// WhatsApp Utility Functions
import { WHATSAPP_NUMBER } from '../constants'
import type { CartItem } from '../types'

/**
 * Format number to Indian Rupees format (e.g. 2999 -> "₹2,999")
 */
export function formatRupees(amount: number): string {
  return `₹${Math.round(amount).toLocaleString('en-IN')}`
}

/**
 * Clean phone number to digits only (e.g. "+91 93463 97838" -> "919346397838")
 */
export function cleanPhoneNumber(phone?: string): string {
  if (!phone) return WHATSAPP_NUMBER
  const cleaned = phone.replace(/[^0-9]/g, '')
  return cleaned.length > 0 ? cleaned : WHATSAPP_NUMBER
}

/**
 * Generate a complete WhatsApp order message containing ALL items in the cart
 */
export function generateCartWhatsAppMessage(items: CartItem[]): string {
  if (!items || items.length === 0) {
    return ''
  }

  const totalItems = items.reduce((sum, item) => sum + (item.quantity || 1), 0)
  const totalAmount = items.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  )

  const itemsFormatted = items
    .map((item, index) => {
      const qty = item.quantity || 1
      const subtotal = item.price * qty
      const details: string[] = []

      details.push(`   Quantity: ${qty}`)
      if (item.color) details.push(`   Color: ${item.color}`)
      if (item.size) details.push(`   Size: ${item.size}`)
      details.push(`   Price: ${formatRupees(item.price)}`)
      details.push(`   Subtotal: ${formatRupees(subtotal)}`)

      return `${index + 1}. *${item.name}*\n${details.join('\n')}`
    })
    .join('\n\n')

  return `Hello! I would like to place an order.

🛍️ *Order Details*

${itemsFormatted}

---

*Total Items:* ${totalItems}
*Total Amount:* ${formatRupees(totalAmount)}
----------------------

Please confirm the availability and order details.`
}

/**
 * Build WhatsApp click-to-chat URL for complete cart order
 */
export function buildWhatsAppCartOrderUrl(
  items: CartItem[],
  phone?: string
): string {
  const targetPhone = cleanPhoneNumber(phone)
  const message = generateCartWhatsAppMessage(items)
  return `https://wa.me/${targetPhone}?text=${encodeURIComponent(message)}`
}

/**
 * Build WhatsApp click-to-chat URL for a single product enquiry
 */
export function buildWhatsAppUrl(params: {
  phone?: string
  productName?: string
  price?: number
  message?: string
}): string {
  const { phone, productName, price, message } = params
  const cleanPhone = cleanPhoneNumber(phone)

  let text: string

  if (productName) {
    text = `Hello Sri Subhakari Fashions,

I am interested in this product.

Product Name: ${productName}
${price ? `Price: ${formatRupees(price)}` : ''}

Please share more details.`
  } else if (message) {
    text = message
  } else {
    text = `Hello Sri Subhakari Fashions,

I would like to enquire about your collection. Please share more details.`
  }

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`
}

/**
 * Build standard direct contact link without pre-filled message
 */
export function buildWhatsAppContactUrl(phone?: string): string {
  const cleanPhone = cleanPhoneNumber(phone)
  return `https://wa.me/${cleanPhone}`
}
