import React, { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ShoppingBag, Check, MessageCircle, ExternalLink } from 'lucide-react'
import type { Product } from '../../types'
import { formatPrice, formatDiscount, getImageUrl } from '../../utils/format'
import { useCart } from '../../context/CartContext'
import { WHATSAPP_NUMBER } from '../../constants'

interface ChatProductCardProps {
  product: Product
  onActionClick?: () => void
}

export function ChatProductCard({ product, onActionClick }: ChatProductCardProps) {
  const { addToCart } = useCart()
  const [added, setAdded] = useState(false)

  const isOutOfStock =
    product.status === 'out_of_stock' ||
    (product.stock_quantity !== undefined && product.stock_quantity !== null && product.stock_quantity <= 0) ||
    (product.stock !== undefined && product.stock !== null && product.stock <= 0) ||
    product.in_stock === false

  const discount = product.offer_price
    ? formatDiscount(product.price, product.offer_price)
    : 0

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isOutOfStock) return

    addToCart(product, {
      quantity: 1,
      color: product.color && product.color.length > 0 ? product.color[0] : null,
      size: product.sizes && product.sizes.length > 0 ? product.sizes[0] : null,
    })

    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
    if (onActionClick) onActionClick()
  }

  const images = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : product.image_url
    ? [product.image_url]
    : []

  const imgUrl = getImageUrl(images[0] || product.image_url)

  const whatsappMsg = encodeURIComponent(
    `Hi Sri Subhakari Fashions! I'm interested in "${product.name}" (Price: ₹${(
      product.offer_price || product.price
    ).toLocaleString('en-IN')}) from your website. Is this available?`
  )
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMsg}`

  return (
    <div className="group relative flex flex-col bg-white rounded-xl border border-pink-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden w-full max-w-[240px] shrink-0 text-left">
      {/* Product Image */}
      <div className="relative aspect-[4/5] bg-gray-50 overflow-hidden">
        <img
          src={imgUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            ;(e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&q=70'
          }}
        />

        {/* Discount Badge */}
        {discount > 0 && (
          <span
            className="absolute top-2 left-2 px-1.5 py-0.5 rounded text-[10px] font-bold text-white shadow-xs"
            style={{ background: 'var(--color-pink)' }}
          >
            {discount}% OFF
          </span>
        )}

        {isOutOfStock && (
          <span className="absolute inset-0 bg-black/50 text-white font-medium text-xs flex items-center justify-center">
            Out of Stock
          </span>
        )}
      </div>

      {/* Product Details */}
      <div className="p-2.5 flex flex-col flex-1 justify-between gap-1.5">
        <div>
          {product.fabric && (
            <span className="text-[10px] uppercase font-semibold tracking-wider text-pink-600 block">
              {product.fabric}
            </span>
          )}
          <Link
            to={`/shop/${product.slug || product.id}`}
            className="text-xs font-semibold text-gray-900 line-clamp-1 hover:text-pink-600 transition-colors"
            title={product.name}
          >
            {product.name}
          </Link>
        </div>

        {/* Price Row */}
        <div className="flex items-baseline gap-1.5">
          <span className="text-sm font-bold text-gray-900 font-price">
            {formatPrice(product.offer_price || product.price)}
          </span>
          {product.offer_price && (
            <span className="text-[11px] text-gray-400 line-through font-price">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-1.5 pt-1">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-[11px] font-medium transition-all ${
              added
                ? 'bg-green-600 text-white'
                : 'bg-[#1f0b24] text-white hover:bg-pink-700'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            title="Add to Cart"
          >
            {added ? (
              <>
                <Check size={12} />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag size={12} />
                <span>Add</span>
              </>
            )}
          </button>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-[11px] font-medium bg-[#25D366]/10 text-[#128C7E] hover:bg-[#25D366]/20 transition-all border border-[#25D366]/30"
            title="Enquire on WhatsApp"
          >
            <MessageCircle size={12} />
            <span>Enquire</span>
          </a>
        </div>
      </div>
    </div>
  )
}
