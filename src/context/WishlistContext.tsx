import React, { createContext, useContext, useEffect, useState, useMemo } from 'react'
import type { Product } from '../types'

interface WishlistContextType {
  items: Product[]
  totalItems: number
  isInWishlist: (productIdOrSlug?: string | null) => boolean
  toggleWishlist: (product: Product) => void
  addToWishlist: (product: Product) => void
  removeFromWishlist: (productIdOrSlug: string) => void
  clearWishlist: () => void
  isWishlistOpen: boolean
  setIsWishlistOpen: (open: boolean) => void
  openWishlist: () => void
  closeWishlist: () => void
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

const WISHLIST_STORAGE_KEY = 'ssf_wishlist_items_v2'

function getProductKey(product: any): string {
  if (!product) return ''
  return String(product.id || product._id || product.slug || '')
}

function matchesProduct(item: any, keyOrProduct: any): boolean {
  if (!item || !keyOrProduct) return false
  const targetKey = typeof keyOrProduct === 'string' ? keyOrProduct : getProductKey(keyOrProduct)
  const itemKey = getProductKey(item)
  
  if (itemKey && targetKey && itemKey === targetKey) return true
  if (item.id && (item.id === targetKey || item.id === keyOrProduct.id)) return true
  if (item._id && (item._id === targetKey || item._id === keyOrProduct._id)) return true
  if (item.slug && (item.slug === targetKey || item.slug === keyOrProduct.slug)) return true
  return false
}

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Product[]>([])
  const [isWishlistOpen, setIsWishlistOpen] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)

  // Load from localStorage on client mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) {
          setItems(parsed)
        }
      }
    } catch (e) {
      console.warn('Failed to load wishlist from localStorage:', e)
    } finally {
      setIsHydrated(true)
    }
  }, [])

  // Save to localStorage when items change
  useEffect(() => {
    if (!isHydrated) return
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items))
    } catch (e) {
      console.warn('Failed to save wishlist to localStorage:', e)
    }
  }, [items, isHydrated])

  const openWishlist = () => setIsWishlistOpen(true)
  const closeWishlist = () => setIsWishlistOpen(false)

  const isInWishlist = (productIdOrSlug?: string | null) => {
    if (!productIdOrSlug) return false
    return items.some((item) => matchesProduct(item, productIdOrSlug))
  }

  const addToWishlist = (product: Product) => {
    if (!product) return
    setItems((prev) => {
      if (prev.some((item) => matchesProduct(item, product))) return prev
      return [...prev, product]
    })
  }

  const removeFromWishlist = (productIdOrSlug: string) => {
    if (!productIdOrSlug) return
    setItems((prev) => prev.filter((item) => !matchesProduct(item, productIdOrSlug)))
  }

  const toggleWishlist = (product: Product) => {
    if (!product) return
    setItems((prev) => {
      const exists = prev.some((item) => matchesProduct(item, product))
      if (exists) {
        return prev.filter((item) => !matchesProduct(item, product))
      } else {
        return [...prev, product]
      }
    })
  }

  const clearWishlist = () => {
    setItems([])
  }

  const totalItems = useMemo(() => items.length, [items])

  const value = useMemo(
    () => ({
      items,
      totalItems,
      isInWishlist,
      toggleWishlist,
      addToWishlist,
      removeFromWishlist,
      clearWishlist,
      isWishlistOpen,
      setIsWishlistOpen,
      openWishlist,
      closeWishlist,
    }),
    [items, totalItems, isWishlistOpen]
  )

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}
