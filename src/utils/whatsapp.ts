// WhatsApp Utility Functions

export function buildWhatsAppUrl(params: {
  phone: string
  productName?: string
  price?: number
  message?: string
}): string {
  const { phone, productName, price, message } = params
  const cleanPhone = phone.replace(/[^0-9]/g, '')

  let text: string

  if (productName) {
    text = `Hello Sri Subhakari Fashions,

I am interested in this product.

Product Name: ${productName}
${price ? `Price: ₹${price.toLocaleString('en-IN')}` : ''}

Please share more details.`
  } else if (message) {
    text = message
  } else {
    text = `Hello Sri Subhakari Fashions,

I would like to enquire about your collection. Please share more details.`
  }

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`
}

export function buildWhatsAppContactUrl(phone: string): string {
  const cleanPhone = phone.replace(/[^0-9]/g, '')
  return `https://wa.me/${cleanPhone}`
}
