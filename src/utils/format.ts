// Format Utility Functions

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price)
}

export function formatDiscount(original: number, offer: number): number {
  return Math.round(((original - offer) / original) * 100)
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length) + '...'
}

const PLACEHOLDERS: Record<string, string> = {
  '/placeholder-saree-1.jpg': 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80',
  '/placeholder-saree-2.jpg': 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&q=80',
  '/placeholder-lehenga.jpg': 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&q=80',
  '/placeholder.jpg': 'https://images.unsplash.com/photo-1608748010899-18f300247112?w=600&q=80'
}

export function getImageUrl(path: string | null | undefined, fallback: string = 'https://images.unsplash.com/photo-1608748010899-18f300247112?w=600&q=80'): string {
  if (!path) return fallback
  if (path.startsWith('http')) return path
  
  if (PLACEHOLDERS[path]) {
    return PLACEHOLDERS[path]
  }

  // Supabase storage URL pattern
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  if (supabaseUrl && path.startsWith('/')) {
    return `${supabaseUrl}/storage/v1/object/public${path}`
  }
  return path
}

export function formatRating(rating: number): string {
  return rating.toFixed(1)
}

export function timeAgo(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}
