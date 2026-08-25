import React, { createContext, useContext, useEffect, useState, useMemo } from 'react'
import type { CartItem, Product } from '../types'

interface AddToCartOptions {
  color?: string | null
  size?: string | null
  quantity?: number
}

interface CartContextType {
  items: CartItem[]
  totalItems: number
  totalAmount: number
  isCartOpen: boolean
  setIsCartOpen: (open: boolean) => void
  openCart: () => void
  closeCart: () => void
  addToCart: (product: Product, options?: AddToCartOptions) => void
  removeFromCart: (cartItemId: string) => void
  updateQuantity: (cartItemId: string, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_STORAGE_KEY = 'ssf_shopping_cart_v1'

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)

  // Load from localStorage on client mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) {
          setItems(parsed)
        }
      }
    } catch (e) {
      console.warn('Failed to load cart from localStorage:', e)
    } finally {
      setIsHydrated(true)
    }
  }, [])

  // Save to localStorage when items change
  useEffect(() => {
    if (!isHydrated) return
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
    } catch (e) {
      console.warn('Failed to save cart to localStorage:', e)
    }
  }, [items, isHydrated])

  const openCart = () => setIsCartOpen(true)
  const closeCart = () => setIsCartOpen(false)

  const addToCart = (product: Product, options?: AddToCartOptions) => {
    const qty = options?.quantity && options.quantity > 0 ? options.quantity : 1
    const color = options?.color || (product.color && product.color.length > 0 ? product.color[0] : null)
    const size = options?.size || (product.sizes && product.sizes.length > 0 ? product.sizes[0] : null)

    const unitPrice = product.offer_price || product.price
    const itemUniqueId = `${product.id}-${color || 'default'}-${size || 'default'}`

    const image = Array.isArray(product.images) && product.images.length > 0
      ? product.images[0]
      : (product.image_url || null)

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.id === itemUniqueId)

      if (existingIndex > -1) {
        const newItems = [...prevItems]
        newItems[existingIndex] = {
          ...newItems[existingIndex],
          quantity: newItems[existingIndex].quantity + qty,
        }
        return newItems
      }

      const newItem: CartItem = {
        id: itemUniqueId,
        productId: product.id,
        name: product.name,
        slug: product.slug,
        price: unitPrice,
        originalPrice: product.offer_price ? product.price : null,
        image,
        quantity: qty,
        color: color || undefined,
        size: size || undefined,
        fabric: product.fabric || undefined,
        stock: product.stock_quantity ?? product.stock ?? undefined,
      }

      return [...prevItems, newItem]
    })

    // Open drawer to give feedback
    setIsCartOpen(true)
  }

  const removeFromCart = (cartItemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== cartItemId))
  }

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId)
      return
    }
    setItems((prev) =>
      prev.map((item) =>
        item.id === cartItemId ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const totalItems = useMemo(() => {
    return items.reduce((sum, item) => sum + (item.quantity || 1), 0)
  }, [items])

  const totalAmount = useMemo(() => {
    return items.reduce(
      (sum, item) => sum + item.price * (item.quantity || 1),
      0
    )
  }, [items])

  const value = useMemo(
    () => ({
      items,
      totalItems,
      totalAmount,
      isCartOpen,
      setIsCartOpen,
      openCart,
      closeCart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
    }),
    [items, totalItems, totalAmount, isCartOpen]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
