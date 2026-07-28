import { createServerFn } from '@tanstack/react-start'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'
import type { Product, ProductFilters, PaginatedResponse } from '../../types'
import fs from 'fs/promises'
import path from 'path'
import crypto from 'crypto'
const getFilePath = (fileName: string) => {
  return path.join(process.cwd(), 'src', 'server', 'data', fileName)
}

async function readJson<T>(fileName: string, defaultData: T): Promise<T> {
  try {
    const file = getFilePath(fileName)
    const raw = await fs.readFile(file, 'utf-8')
    return JSON.parse(raw)
  } catch (err) {
    return defaultData
  }
}

async function writeJson<T>(fileName: string, data: T): Promise<void> {
  const file = getFilePath(fileName)
  await fs.writeFile(file, JSON.stringify(data, null, 2), 'utf-8')
}

// 1. Get Products
export const getProductsServerFn = createServerFn({
  method: 'GET',
})
  .validator((filters: ProductFilters) => filters)
  .handler(async ({ data: filters }) => {
    if (!isSupabaseConfigured()) {
      // Demo mode: Read from JSON file
      let products = await readJson<Product[]>('products.json', [])
      const categories = await readJson<any[]>('categories.json', [])

      // Map category object to products
      products = products.map((p) => ({
        ...p,
        category: categories.find((c) => c.id === p.category_id) || null,
      }))

      if (filters.search) {
        const q = filters.search.toLowerCase()
        products = products.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.description?.toLowerCase().includes(q) ||
            (p.category?.name && p.category.name.toLowerCase().includes(q)),
        )
      }
      if (filters.category) {
        products = products.filter(
          (p) =>
            p.category_id === filters.category ||
            p.category?.slug === filters.category,
        )
      }
      if (filters.fabric) {
        products = products.filter((p) => p.fabric === filters.fabric)
      }
      if (filters.newArrival) products = products.filter((p) => p.new_arrival)
      if (filters.bestSeller) products = products.filter((p) => p.best_seller)
      if (filters.featured) products = products.filter((p) => p.featured)
      if (filters.minPrice !== undefined) {
        products = products.filter((p) => (p.offer_price || p.price) >= filters.minPrice!)
      }
      if (filters.maxPrice !== undefined) {
        products = products.filter((p) => (p.offer_price || p.price) <= filters.maxPrice!)
      }
      if (filters.color) {
        products = products.filter((p) => p.color?.includes(filters.color!))
      }
      if (filters.size) {
        products = products.filter((p) => p.sizes?.includes(filters.size!))
      }

      // Sorting
      switch (filters.sortBy) {
        case 'price_asc':
          products.sort((a, b) => (a.offer_price || a.price) - (b.offer_price || b.price))
          break
        case 'price_desc':
          products.sort((a, b) => (b.offer_price || b.price) - (a.offer_price || a.price))
          break
        case 'popular':
          products.sort((a, b) => (b.review_count || 0) - (a.review_count || 0))
          break
        default:
          products.sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime())
      }

      const page = filters.page || 1
      const limit = filters.limit || 12
      const start = (page - 1) * limit
      return {
        data: products.slice(start, start + limit),
        total: products.length,
        page,
        limit,
        hasMore: start + limit < products.length,
      } as PaginatedResponse<Product>
    }

    // Supabase Mode
    const page = filters.page || 1
    const limit = filters.limit || 12
    const from = (page - 1) * limit
    const to = from + limit - 1

    let query = supabase
      .from('products')
      .select('*, category:categories(*)', { count: 'exact' })

    if (filters.search) query = query.ilike('name', `%${filters.search}%`)
    if (filters.category) query = query.eq('category_id', filters.category)
    if (filters.fabric) query = query.eq('fabric', filters.fabric)
    if (filters.minPrice !== undefined) query = query.gte('price', filters.minPrice)
    if (filters.maxPrice !== undefined) query = query.lte('price', filters.maxPrice)
    if (filters.newArrival) query = query.eq('new_arrival', true)
    if (filters.bestSeller) query = query.eq('best_seller', true)
    if (filters.featured) query = query.eq('featured', true)

    // Sorting
    switch (filters.sortBy) {
      case 'price_asc':
        query = query.order('price', { ascending: true })
        break
      case 'price_desc':
        query = query.order('price', { ascending: false })
        break
      case 'popular':
        query = query.order('review_count', { ascending: false })
        break
      default:
        query = query.order('created_at', { ascending: false })
    }

    query = query.range(from, to)
    const { data, error, count } = await query

    if (error) throw new Error(error.message)
    return {
      data: (data as Product[]) || [],
      total: count || 0,
      page,
      limit,
      hasMore: (count || 0) > to + 1,
    } as PaginatedResponse<Product>
  })

// 2. Get Product By Slug
export const getProductBySlugServerFn = createServerFn({
  method: 'GET',
})
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    if (!isSupabaseConfigured()) {
      const products = await readJson<Product[]>('products.json', [])
      const categories = await readJson<any[]>('categories.json', [])
      const product = products.find((p) => p.slug === slug)
      if (!product) return null
      return {
        ...product,
        category: categories.find((c) => c.id === product.category_id) || null,
      } as Product
    }

    const { data, error } = await supabase
      .from('products')
      .select('*, category:categories(*)')
      .eq('slug', slug)
      .single()

    if (error) return null
    return data as Product
  })

// 3. Get Featured Products
export const getFeaturedProductsServerFn = createServerFn({
  method: 'GET',
})
  .handler(async () => {
    if (!isSupabaseConfigured()) {
      const products = await readJson<Product[]>('products.json', [])
      const categories = await readJson<any[]>('categories.json', [])
      return products
        .filter((p) => p.featured)
        .slice(0, 8)
        .map((p) => ({
          ...p,
          category: categories.find((c) => c.id === p.category_id) || null,
        })) as Product[]
    }

    const { data, error } = await supabase
      .from('products')
      .select('*, category:categories(*)')
      .eq('featured', true)
      .order('created_at', { ascending: false })
      .limit(8)

    if (error) return []
    return (data as Product[]) || []
  })

// 4. Get Best Sellers
export const getBestSellersServerFn = createServerFn({
  method: 'GET',
})
  .handler(async () => {
    if (!isSupabaseConfigured()) {
      const products = await readJson<Product[]>('products.json', [])
      const categories = await readJson<any[]>('categories.json', [])
      return products
        .filter((p) => p.best_seller)
        .slice(0, 8)
        .map((p) => ({
          ...p,
          category: categories.find((c) => c.id === p.category_id) || null,
        })) as Product[]
    }

    const { data, error } = await supabase
      .from('products')
      .select('*, category:categories(*)')
      .eq('best_seller', true)
      .order('review_count', { ascending: false })
      .limit(8)

    if (error) return []
    return (data as Product[]) || []
  })

// 5. Get New Arrivals
export const getNewArrivalsServerFn = createServerFn({
  method: 'GET',
})
  .handler(async () => {
    if (!isSupabaseConfigured()) {
      const products = await readJson<Product[]>('products.json', [])
      const categories = await readJson<any[]>('categories.json', [])
      return products
        .filter((p) => p.new_arrival)
        .slice(0, 8)
        .map((p) => ({
          ...p,
          category: categories.find((c) => c.id === p.category_id) || null,
        })) as Product[]
    }

    const { data, error } = await supabase
      .from('products')
      .select('*, category:categories(*)')
      .eq('new_arrival', true)
      .order('created_at', { ascending: false })
      .limit(8)

    if (error) return []
    return (data as Product[]) || []
  })

// 6. Get Related Products
export const getRelatedProductsServerFn = createServerFn({
  method: 'GET',
})
  .validator((data: { productId: string; categoryId?: string }) => data)
  .handler(async ({ data: { productId, categoryId } }) => {
    if (!isSupabaseConfigured()) {
      const products = await readJson<Product[]>('products.json', [])
      return products
        .filter((p) => p.id !== productId && (!categoryId || p.category_id === categoryId))
        .slice(0, 4)
    }

    let query = supabase
      .from('products')
      .select('*, category:categories(*)')
      .neq('id', productId)
      .limit(4)

    if (categoryId) query = query.eq('category_id', categoryId)

    const { data, error } = await query
    if (error) return []
    return (data as Product[]) || []
  })

// 7. Create Product
export const createProductServerFn = createServerFn({
  method: 'POST',
})
  .validator((product: Partial<Product>) => product)
  .handler(async ({ data: product }) => {
    if (!isSupabaseConfigured()) {
      const products = await readJson<Product[]>('products.json', [])
      const newProduct: Product = {
        id: Math.random().toString(36).substring(2, 11),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        name: '',
        slug: '',
        price: 0,
        stock: 0,
        tags: [],
        in_stock: true,
        ...product,
      } as Product
      products.unshift(newProduct)
      await writeJson('products.json', products)
      return newProduct
    }

    const { category, ...insertData } = product
    if (!insertData.id) {
      insertData.id = crypto.randomUUID()
    }
    if (insertData.category_id === '') {
      insertData.category_id = null
    }

    const { data, error } = await supabase
      .from('products')
      .insert(insertData)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data as Product
  })

// 8. Update Product
export const updateProductServerFn = createServerFn({
  method: 'POST',
})
  .validator((data: { id: string; updates: Partial<Product> }) => data)
  .handler(async ({ data: { id, updates } }) => {
    if (!isSupabaseConfigured()) {
      const products = await readJson<Product[]>('products.json', [])
      const idx = products.findIndex((p) => p.id === id)
      if (idx === -1) throw new Error('Product not found')
      const updated = {
        ...products[idx],
        ...updates,
        updated_at: new Date().toISOString(),
      }
      products[idx] = updated
      await writeJson('products.json', products)
      return updated
    }

    const { category, ...updateData } = updates
    if (updateData.category_id === '') {
      updateData.category_id = null
    }

    const { data, error } = await supabase
      .from('products')
      .update({ ...updateData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data as Product
  })

// 9. Delete Product
export const deleteProductServerFn = createServerFn({
  method: 'POST',
})
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    if (!isSupabaseConfigured()) {
      const products = await readJson<Product[]>('products.json', [])
      const updated = products.filter((p) => p.id !== id)
      await writeJson('products.json', updated)
      return
    }

    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) throw new Error(error.message)
  })
