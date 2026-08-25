import type { Product, ProductFilters, PaginatedResponse, Category } from '../types'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { deleteProductImages } from '../lib/storage'
import { STATIC_CATEGORIES, getStaticCategory, getCategoryFilterIdentifiers } from '../constants/categories'
import {
  getProductsServerFn,
  getProductBySlugServerFn,
  getFeaturedProductsServerFn,
  getBestSellersServerFn,
  getNewArrivalsServerFn,
  getFestivalProductsServerFn,
  getRelatedProductsServerFn,
  createProductServerFn,
  updateProductServerFn,
  deleteProductServerFn,
  formatProductRecord,
} from '../server/functions/products'

export { formatProductRecord }

// Fetch categories map for joining with products in client
async function fetchClientCategoriesMap(): Promise<Map<string, Category>> {
  const map = new Map<string, Category>()
  try {
    const { data: dbCats } = await supabase.from('categories').select('*')
    if (dbCats && dbCats.length > 0) {
      dbCats.forEach((c) => {
        const staticCat = getStaticCategory(c.slug) || getStaticCategory(c.name) || getStaticCategory(c.id)
        const cat: Category = {
          id: String(c.id),
          name: c.name,
          slug: c.slug,
          image: staticCat?.image || c.image || null,
          description: staticCat?.description || c.description || null,
        }
        map.set(String(c.id), cat)
        map.set(c.slug.toLowerCase(), cat)
        map.set(c.name.toLowerCase(), cat)
      })
    }
  } catch (err: any) {
    console.warn('Failed to fetch categories map:', err.message)
  }
  return map
}

// 1. Get Products (Direct Supabase query in browser or Server Function in SSR)
export async function getProducts(
  filters: ProductFilters = {},
): Promise<PaginatedResponse<Product>> {
  if (isSupabaseConfigured() && typeof window !== 'undefined') {
    try {
      const page = filters.page || 1
      const limit = filters.limit || 12
      const from = (page - 1) * limit
      const to = from + limit - 1

      const categoriesMap = await fetchClientCategoriesMap()

      let query = supabase.from('products').select('*', { count: 'exact' })

      if (filters.search) {
        const s = filters.search.trim()
        query = query.or(`name.ilike.%${s}%,description.ilike.%${s}%,fabric.ilike.%${s}%`)
      }

      if (filters.category) {
        const identifiers = getCategoryFilterIdentifiers(filters.category)
        const matched = categoriesMap.get(filters.category.toLowerCase().trim()) || categoriesMap.get(filters.category)
        if (matched) {
          identifiers.push(matched.id, matched.slug, matched.name)
        }
        const uniqueIds = Array.from(new Set(identifiers.map((s) => String(s).trim()).filter(Boolean)))
        const orConditions = uniqueIds.map((id) => `category_id.eq.${id}`).join(',')
        if (orConditions) {
          query = query.or(orConditions)
        }
      }

      if (filters.fabric) query = query.eq('fabric', filters.fabric)
      if (filters.minPrice !== undefined) query = query.gte('price', filters.minPrice)
      if (filters.maxPrice !== undefined) query = query.lte('price', filters.maxPrice)
      if (filters.newArrival || filters.collection === 'new-arrivals') query = query.eq('new_arrival', true)
      if (filters.bestSeller || filters.collection === 'best-sellers') query = query.eq('best_seller', true)
      if (filters.featured || filters.collection === 'featured-sarees') query = query.eq('featured', true)

      switch (filters.sortBy) {
        case 'price_asc':
          query = query.order('price', { ascending: true })
          break
        case 'price_desc':
          query = query.order('price', { ascending: false })
          break
        case 'popular':
          query = query.order('review_count', { ascending: false, nullsFirst: false })
          break
        default:
          query = query.order('created_at', { ascending: false })
      }

      query = query.range(from, to)
      const { data, error, count } = await query

      if (!error && data !== null) {
        const formatted = data.map((p) => {
          const catObj = p.category_id
            ? categoriesMap.get(String(p.category_id)) ||
              categoriesMap.get(String(p.category_id).toLowerCase()) ||
              getStaticCategory(p.category_id)
            : null
          return formatProductRecord(p, catObj)
        })
        const totalCount = count !== null && count !== undefined ? count : formatted.length
        return {
          data: formatted,
          total: totalCount,
          page,
          limit,
          hasMore: totalCount > to + 1,
        }
      }
    } catch (err: any) {
      console.warn('Direct client getProducts notice:', err.message)
    }
  }

  return await getProductsServerFn({ data: filters })
}

// 2. Get Product By Slug
export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (isSupabaseConfigured() && typeof window !== 'undefined') {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .maybeSingle()

      if (!error && data) {
        let categoryObj = null
        if (data.category_id) {
          const { data: cat } = await supabase
            .from('categories')
            .select('id, name, slug, description, image')
            .eq('id', data.category_id)
            .maybeSingle()
          categoryObj = cat
        }
        return formatProductRecord(data, categoryObj)
      }
    } catch (err: any) {
      console.warn('Direct client getProductBySlug notice:', err.message)
    }
  }

  return await getProductBySlugServerFn({ data: slug })
}

// 3. Get Featured Products
export async function getFeaturedProducts(): Promise<Product[]> {
  if (isSupabaseConfigured() && typeof window !== 'undefined') {
    try {
      const categoriesMap = await fetchClientCategoriesMap()
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('featured', true)
        .order('created_at', { ascending: false })
        .limit(8)

      if (!error && data && data.length > 0) {
        return data.map((p) => {
          const catObj = p.category_id ? categoriesMap.get(p.category_id) || categoriesMap.get(p.category_id.toLowerCase()) : null
          return formatProductRecord(p, catObj)
        })
      }
    } catch (err: any) {
      console.warn('Direct client getFeaturedProducts notice:', err.message)
    }
  }

  return await getFeaturedProductsServerFn()
}

// 4. Get Best Sellers
export async function getBestSellers(): Promise<Product[]> {
  if (isSupabaseConfigured() && typeof window !== 'undefined') {
    try {
      const categoriesMap = await fetchClientCategoriesMap()
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('best_seller', true)
        .order('created_at', { ascending: false })
        .limit(8)

      if (!error && data && data.length > 0) {
        return data.map((p) => {
          const catObj = p.category_id ? categoriesMap.get(p.category_id) || categoriesMap.get(p.category_id.toLowerCase()) : null
          return formatProductRecord(p, catObj)
        })
      }
    } catch (err: any) {
      console.warn('Direct client getBestSellers notice:', err.message)
    }
  }

  return await getBestSellersServerFn()
}

// 5. Get New Arrivals
export async function getNewArrivals(): Promise<Product[]> {
  if (isSupabaseConfigured() && typeof window !== 'undefined') {
    try {
      const categoriesMap = await fetchClientCategoriesMap()
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('new_arrival', true)
        .order('created_at', { ascending: false })
        .limit(8)

      if (!error && data && data.length > 0) {
        return data.map((p) => {
          const catObj = p.category_id ? categoriesMap.get(p.category_id) || categoriesMap.get(p.category_id.toLowerCase()) : null
          return formatProductRecord(p, catObj)
        })
      }
    } catch (err: any) {
      console.warn('Direct client getNewArrivals notice:', err.message)
    }
  }

  return await getNewArrivalsServerFn()
}

// 6. Get Festival Products
export async function getFestivalProducts(): Promise<Product[]> {
  if (isSupabaseConfigured() && typeof window !== 'undefined') {
    try {
      const categoriesMap = await fetchClientCategoriesMap()
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(8)

      if (!error && data && data.length > 0) {
        return data.map((p) => {
          const catObj = p.category_id ? categoriesMap.get(p.category_id) || categoriesMap.get(p.category_id.toLowerCase()) : null
          return formatProductRecord(p, catObj)
        })
      }
    } catch (err: any) {
      console.warn('Direct client getFestivalProducts notice:', err.message)
    }
  }

  return await getFestivalProductsServerFn()
}

// 7. Get Related Products
export async function getRelatedProducts(
  productId: string,
  categoryId?: string,
): Promise<Product[]> {
  if (isSupabaseConfigured() && typeof window !== 'undefined') {
    try {
      const categoriesMap = await fetchClientCategoriesMap()
      let query = supabase.from('products').select('*').neq('id', productId).limit(4)
      if (categoryId) {
        query = query.eq('category_id', categoryId)
      }
      const { data, error } = await query
      if (!error && data && data.length > 0) {
        return data.map((p) => {
          const catObj = p.category_id ? categoriesMap.get(p.category_id) || categoriesMap.get(p.category_id.toLowerCase()) : null
          return formatProductRecord(p, catObj)
        })
      }
    } catch (err: any) {
      console.warn('Direct client getRelatedProducts notice:', err.message)
    }
  }

  return await getRelatedProductsServerFn({ data: { productId, categoryId } })
}

// 8. Create Product in Supabase
export async function createProduct(product: Partial<Product>): Promise<Product> {
  const stockQty =
    product.stock_quantity !== undefined && product.stock_quantity !== null
      ? Number(product.stock_quantity)
      : (product.stock !== undefined && product.stock !== null ? Number(product.stock) : 0)

  const inStock = stockQty > 0 && product.in_stock !== false

  const imagesArray = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : (product.image_url ? [product.image_url] : [])

  const newId = product.id || ('prod_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7))

  const primaryImageUrl = product.image_url || imagesArray[0] || null

  const insertData = {
    id: newId,
    name: product.name,
    slug: product.slug,
    description: product.description || '',
    price: product.price ? Number(product.price) : 0,
    offer_price: product.offer_price ? Number(product.offer_price) : null,
    category_id: product.category_id || null,
    stock_quantity: stockQty,
    stock: stockQty,
    in_stock: inStock,
    image_url: primaryImageUrl,
    images: imagesArray,
    fabric: product.fabric || null,
    color: product.color || [],
    sizes: product.sizes || [],
    sku: product.sku || null,
    wash_care: product.wash_care || null,
    rating: product.rating !== undefined ? Number(product.rating) : 4.8,
    review_count: product.review_count !== undefined ? Number(product.review_count) : 0,
    featured: Boolean(product.featured),
    best_seller: Boolean(product.best_seller),
    new_arrival: Boolean(product.new_arrival),
    tags: product.tags || [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  if (isSupabaseConfigured() && typeof window !== 'undefined') {
    let { data, error } = await supabase
      .from('products')
      .insert(insertData)
      .select()
      .single()

    // If image_url column does not exist yet in DB schema, retry without it
    if (error && error.message?.includes('image_url')) {
      const fallbackData = { ...insertData }
      delete fallbackData.image_url
      const retry = await supabase.from('products').insert(fallbackData).select().single()
      data = retry.data
      error = retry.error
    }

    if (!error && data) {
      return formatProductRecord(data)
    }
    if (error) {
      console.error('Supabase direct insert error:', error.message)
      throw new Error(`Failed to save product in Supabase: ${error.message}`)
    }
  }

  return await createProductServerFn({ data: product })
}

// 9. Update Product in Supabase
export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
  let stockQty = updates.stock_quantity !== undefined && updates.stock_quantity !== null
    ? Number(updates.stock_quantity)
    : (updates.stock !== undefined && updates.stock !== null ? Number(updates.stock) : undefined)

  const imagesArray = Array.isArray(updates.images)
    ? updates.images
    : (updates.image_url ? [updates.image_url] : undefined)

  const updatePayload: any = {
    updated_at: new Date().toISOString(),
  }

  if (updates.name !== undefined) updatePayload.name = updates.name
  if (updates.slug !== undefined) updatePayload.slug = updates.slug
  if (updates.description !== undefined) updatePayload.description = updates.description
  if (updates.price !== undefined) updatePayload.price = Number(updates.price)
  if (updates.offer_price !== undefined) updatePayload.offer_price = updates.offer_price ? Number(updates.offer_price) : null
  if (updates.category_id !== undefined) updatePayload.category_id = updates.category_id || null
  if (stockQty !== undefined) {
    updatePayload.stock = stockQty
    updatePayload.stock_quantity = stockQty
    updatePayload.in_stock = stockQty > 0 && updates.in_stock !== false
  } else if (updates.in_stock !== undefined) {
    updatePayload.in_stock = Boolean(updates.in_stock)
  }
  if (imagesArray !== undefined) {
    updatePayload.images = imagesArray
    updatePayload.image_url = imagesArray[0] || null
  } else if (updates.image_url !== undefined) {
    updatePayload.image_url = updates.image_url
  }
  if (updates.fabric !== undefined) updatePayload.fabric = updates.fabric
  if (updates.color !== undefined) updatePayload.color = updates.color
  if (updates.sizes !== undefined) updatePayload.sizes = updates.sizes
  if (updates.sku !== undefined) updatePayload.sku = updates.sku
  if (updates.wash_care !== undefined) updatePayload.wash_care = updates.wash_care
  if (updates.featured !== undefined) updatePayload.featured = Boolean(updates.featured)
  if (updates.best_seller !== undefined) updatePayload.best_seller = Boolean(updates.best_seller)
  if (updates.new_arrival !== undefined) updatePayload.new_arrival = Boolean(updates.new_arrival)
  if (updates.tags !== undefined) updatePayload.tags = updates.tags

  if (isSupabaseConfigured() && typeof window !== 'undefined') {
    let { data, error } = await supabase
      .from('products')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single()

    if (error && error.message?.includes('image_url')) {
      const fallbackPayload = { ...updatePayload }
      delete fallbackPayload.image_url
      const retry = await supabase.from('products').update(fallbackPayload).eq('id', id).select().single()
      data = retry.data
      error = retry.error
    }

    if (!error && data) {
      return formatProductRecord(data)
    }
    if (error) {
      console.error('Supabase direct update error:', error.message)
      throw new Error(`Failed to update product in Supabase: ${error.message}`)
    }
  }

  return await updateProductServerFn({ data: { id, updates } })
}

// 10. Delete Product from Supabase & Storage
export async function deleteProduct(id: string): Promise<void> {
  if (isSupabaseConfigured() && typeof window !== 'undefined') {
    try {
      // 1. Fetch images to clean up storage
      const { data: prod } = await supabase
        .from('products')
        .select('images')
        .eq('id', id)
        .maybeSingle()

      if (prod && Array.isArray(prod.images) && prod.images.length > 0) {
        await deleteProductImages(prod.images)
      }

      // 2. Delete row from database
      const { error } = await supabase.from('products').delete().eq('id', id)
      if (error) {
        console.error('Supabase direct delete error:', error.message)
        throw new Error(`Failed to delete product in Supabase: ${error.message}`)
      }
      return
    } catch (err: any) {
      console.error('Direct client delete error:', err.message)
      throw err
    }
  }

  return await deleteProductServerFn({ data: id })
}


