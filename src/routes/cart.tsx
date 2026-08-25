import { createFileRoute, Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Truck,
  Sparkles,
  RotateCcw,
} from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa'
import { useCart } from '../context/CartContext'
import { formatRupees, buildWhatsAppCartOrderUrl } from '../utils/whatsapp'
import { getImageUrl } from '../utils/format'

export const Route = createFileRoute('/cart')({
  head: () => ({
    meta: [
      { title: 'Shopping Cart — Sri Subhakari Fashions' },
      {
        name: 'description',
        content:
          'Review your shopping cart and place your order directly on WhatsApp with Sri Subhakari Fashions.',
      },
    ],
  }),
  component: CartPage,
})

function CartPage() {
  const { items, totalItems, totalAmount, updateQuantity, removeFromCart, clearCart } =
    useCart()

  const handleWhatsAppOrder = () => {
    if (!items || items.length === 0) {
      alert('Your cart is empty.')
      return
    }

    const url = buildWhatsAppCartOrderUrl(items)
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div style={{ background: 'var(--color-bg)' }} className="min-h-screen">
      <div className="container-brand px-4 sm:px-6 py-8 md:py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6 font-nav">
          <Link to="/" className="hover:text-pink-500 transition-colors">
            Home
          </Link>
          <span>/</span>
          <span style={{ color: 'var(--color-pink)' }}>Shopping Cart</span>
        </nav>

        {/* Page Title */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-gray-200">
          <div>
            <span className="section-badge">Review & Checkout</span>
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 mt-1">
              Your Shopping Cart
            </h1>
          </div>
          {items.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs font-nav text-gray-500 hover:text-red-600 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 hover:border-red-200 transition-colors"
            >
              <RotateCcw size={13} />
              <span>Clear Cart</span>
            </button>
          )}
        </div>

        {/* Cart Content */}
        {items.length === 0 ? (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 px-4 bg-gray-50/70 rounded-3xl border border-gray-100 max-w-2xl mx-auto my-6"
          >
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner"
              style={{ background: 'var(--color-pink-light)' }}
            >
              <ShoppingBag size={44} style={{ color: 'var(--color-pink)' }} />
            </div>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-gray-800 mb-3">
              Your cart is empty.
            </h2>
            <p className="text-gray-500 text-sm md:text-base max-w-md mx-auto mb-8 font-body">
              Looks like you haven't added any handcrafted sarees or ethnic wear yet. Explore our
              curated collection to find your next festive outfit!
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/shop" className="btn-pink px-8 py-3 flex items-center gap-2 text-sm font-bold">
                <span>Browse Products</span>
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/"
                className="px-6 py-3 rounded-full border border-gray-300 text-gray-700 hover:border-pink-300 hover:text-pink-600 font-nav text-sm font-semibold transition-colors bg-white"
              >
                Back to Home
              </Link>
            </div>
          </motion.div>
        ) : (
          /* Active Cart Grid */
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* Left: Cart Items List */}
            <div className="lg:col-span-8 space-y-4">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
                <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-3.5 bg-[#1f0b24] text-white text-xs font-nav font-semibold uppercase tracking-wider">
                  <div className="col-span-6">Product</div>
                  <div className="col-span-2 text-center">Price</div>
                  <div className="col-span-2 text-center">Quantity</div>
                  <div className="col-span-2 text-right">Subtotal</div>
                </div>

                <div className="divide-y divide-gray-100">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="p-4 sm:p-6 transition-colors hover:bg-gray-50/40"
                    >
                      <div className="grid sm:grid-cols-12 gap-4 items-center">
                        {/* Product info */}
                        <div className="sm:col-span-6 flex gap-4 items-center">
                          <Link
                            to="/shop/$slug"
                            params={{ slug: item.slug }}
                            className="shrink-0 w-20 h-24 sm:w-24 sm:h-28 rounded-xl overflow-hidden bg-gray-100 border border-gray-200"
                          >
                            <img
                              src={getImageUrl(item.image)}
                              alt={item.name}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                ;(e.target as HTMLImageElement).src =
                                  'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=300&q=70'
                              }}
                            />
                          </Link>
                          <div className="min-w-0 flex-1">
                            <Link
                              to="/shop/$slug"
                              params={{ slug: item.slug }}
                              className="font-heading font-bold text-gray-900 text-base hover:text-pink-600 transition-colors line-clamp-2"
                            >
                              {item.name}
                            </Link>

                            {/* Tags / attributes */}
                            {(item.color || item.size || item.fabric) && (
                              <div className="flex flex-wrap gap-2 text-xs text-gray-500 mt-1 font-nav">
                                {item.color && (
                                  <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700">
                                    Color: {item.color}
                                  </span>
                                )}
                                {item.size && (
                                  <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700">
                                    Size: {item.size}
                                  </span>
                                )}
                                {item.fabric && (
                                  <span className="text-gray-400">({item.fabric})</span>
                                )}
                              </div>
                            )}

                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="mt-2 text-xs font-nav text-red-500 hover:text-red-700 flex items-center gap-1 transition-colors"
                              aria-label="Remove item"
                            >
                              <Trash2 size={13} />
                              <span>Remove</span>
                            </button>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="sm:col-span-2 text-left sm:text-center">
                          <span className="sm:hidden text-xs text-gray-400 font-nav mr-2">Price:</span>
                          <span
                            className="font-price font-semibold text-sm sm:text-base"
                            style={{ color: 'var(--color-pink)' }}
                          >
                            {formatRupees(item.price)}
                          </span>
                        </div>

                        {/* Quantity Stepper */}
                        <div className="sm:col-span-2 flex items-center justify-start sm:justify-center">
                          <span className="sm:hidden text-xs text-gray-400 font-nav mr-2">Qty:</span>
                          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white shadow-2xs">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-pink-100 hover:text-pink-600 transition-colors"
                              aria-label="Decrease quantity"
                            >
                              {item.quantity === 1 ? (
                                <Trash2 size={13} className="text-red-500" />
                              ) : (
                                <Minus size={13} />
                              )}
                            </button>
                            <span className="w-10 text-center text-xs font-bold font-nav text-gray-900">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-pink-100 hover:text-pink-600 transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus size={13} />
                            </button>
                          </div>
                        </div>

                        {/* Subtotal */}
                        <div className="sm:col-span-2 text-left sm:text-right">
                          <span className="sm:hidden text-xs text-gray-400 font-nav mr-2">Subtotal:</span>
                          <span className="font-price font-bold text-base sm:text-lg text-gray-900">
                            {formatRupees(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Continue Shopping Link */}
              <div className="flex justify-between items-center pt-2">
                <Link
                  to="/shop"
                  className="font-nav text-sm font-semibold text-gray-600 hover:text-pink-600 flex items-center gap-2 transition-colors"
                >
                  <span>← Continue Shopping</span>
                </Link>
                <span className="text-xs text-gray-400 font-nav">
                  Prices are inclusive of all standard taxes
                </span>
              </div>
            </div>

            {/* Right: Order Summary Card */}
            <div className="lg:col-span-4 sticky top-24">
              <div
                className="bg-white rounded-3xl p-6 sm:p-7 border shadow-lg space-y-6"
                style={{
                  borderColor: 'rgba(216,92,138,0.2)',
                  boxShadow: '0 10px 40px rgba(216,92,138,0.08)',
                }}
              >
                <div className="border-b border-gray-100 pb-4">
                  <span className="section-badge text-[11px]">Direct Store Checkout</span>
                  <h2 className="font-heading text-xl font-bold text-gray-900 mt-1">
                    Order Summary
                  </h2>
                </div>

                {/* Items & Price Breakdown */}
                <div className="space-y-3 font-nav text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Total Items</span>
                    <span className="font-semibold text-gray-900">{totalItems}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cart Subtotal</span>
                    <span className="font-price font-semibold text-gray-900">
                      {formatRupees(totalAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between text-green-700">
                    <span>Delivery Enquiry</span>
                    <span className="font-semibold text-xs bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                      Calculated on WhatsApp
                    </span>
                  </div>

                  <div className="border-t border-gray-200 pt-3 flex justify-between items-baseline">
                    <div>
                      <span className="font-heading text-lg font-bold text-gray-900 block">
                        Total Amount
                      </span>
                      <span className="text-[11px] text-gray-400">
                        ({totalItems} {totalItems === 1 ? 'item' : 'items'})
                      </span>
                    </div>
                    <span
                      className="font-price text-2xl md:text-3xl font-bold"
                      style={{ color: 'var(--color-pink)' }}
                    >
                      {formatRupees(totalAmount)}
                    </span>
                  </div>
                </div>

                {/* Order on WhatsApp CTA Button */}
                <div className="space-y-2.5">
                  <button
                    onClick={handleWhatsAppOrder}
                    className="btn-whatsapp w-full py-4 flex items-center justify-center gap-3 text-base shadow-xl shadow-green-600/25 font-nav font-bold tracking-wide cursor-pointer transform hover:-translate-y-0.5 transition-all"
                    id="cart-order-on-whatsapp-btn"
                  >
                    <FaWhatsapp size={22} className="shrink-0" />
                    <span>Order on WhatsApp</span>
                  </button>

                  <p className="text-[12px] text-gray-500 text-center font-nav leading-snug px-2">
                    Clicking will open WhatsApp with your pre-filled cart details ready to send.
                  </p>
                </div>

                {/* Benefits / Guarantees */}
                <div className="border-t border-gray-100 pt-5 space-y-3 text-xs text-gray-600 font-nav">
                  <div className="flex items-start gap-2.5">
                    <ShieldCheck size={16} className="text-pink-600 shrink-0 mt-0.5" />
                    <span>100% Quality inspected genuine fabrics directly from weavers</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Truck size={16} className="text-pink-600 shrink-0 mt-0.5" />
                    <span>Pan-India shipping with safe and secure packaging</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Sparkles size={16} className="text-pink-600 shrink-0 mt-0.5" />
                    <span>Personalized assistance & color matching via WhatsApp</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
