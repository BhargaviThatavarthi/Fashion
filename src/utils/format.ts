import { supabaseUrl } from '../lib/supabase'

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
  '/placeholder-saree-1.jpg': '/images/silk-saree.png',
  '/placeholder-saree-2.jpg': '/images/crape-saree.png',
  '/placeholder-lehenga.jpg': '/images/designer-saree.png',
  '/placeholder-cotton.jpg': '/images/cotton-saree.png',
  '/placeholder.jpg': '/images/silk-saree.png'
}

export function getImageUrl(path: string | null | undefined, fallback: string = '/images/silk-saree.png'): string {
  if (!path || typeof path !== 'string' || path.trim() === '') return fallback
  const trimmed = path.trim()

  // 1. Direct external HTTP / HTTPS URLs (e.g. public Supabase Storage CDN, Unsplash, etc.)
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    // If it points to localhost or private 127.0.0.1 in production, reject and use fallback
    if (trimmed.includes('localhost') || trimmed.includes('127.0.0.1')) {
      return fallback
    }
    return trimmed
  }

  // 2. Allow active browser blob/data URLs only in browser environment
  if (trimmed.startsWith('blob:') || trimmed.startsWith('data:')) {
    return trimmed
  }

  // 3. Known static placeholders
  if (PLACEHOLDERS[trimmed]) {
    return PLACEHOLDERS[trimmed]
  }

  // 4. Bundled local static assets (e.g. /images/silk-saree.png)
  if (trimmed.startsWith('/images/')) {
    return trimmed
  }

  // 5. Supabase Storage resolution
  const targetBaseUrl = (supabaseUrl && !supabaseUrl.includes('placeholder'))
    ? supabaseUrl.replace(/\/+$/, '')
    : 'https://kmxsgomxxhwpmoayeqmj.supabase.co'

  if (trimmed.startsWith('/storage/v1/object/public/')) {
    return `${targetBaseUrl}${trimmed}`
  }
  if (trimmed.startsWith('storage/v1/object/public/')) {
    return `${targetBaseUrl}/${trimmed}`
  }
  if (trimmed.startsWith('/product-images/') || trimmed.startsWith('/products/')) {
    return `${targetBaseUrl}/storage/v1/object/public${trimmed}`
  }
  if (trimmed.startsWith('product-images/') || trimmed.startsWith('products/')) {
    return `${targetBaseUrl}/storage/v1/object/public/${trimmed}`
  }

  // Relative category path or image filename (e.g. "dress-materials/1787567_tt.jpg" or "general/photo.jpg")
  const cleanPath = trimmed.replace(/^\/+/, '')
  return `${targetBaseUrl}/storage/v1/object/public/product-images/${cleanPath}`
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
