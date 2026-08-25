import { createServerFn } from '@tanstack/react-start'
import { supabase } from '../../lib/supabase'
import { deleteProductImages } from '../../lib/storage'
import type { Product, ProductFilters, PaginatedResponse, Category } from '../../types'

// Helper to normalize product properties from database
export function formatProductRecord(p: any, categoryObj?: any): Product {
  const stockQty =
    p.stock_quantity !== undefined && p.stock_quantity !== null
      ? Number(p.stock_quantity)
      : (p.stock !== undefined && p.stock !== null ? Number(p.stock) : 0)

  const inStock = p.in_stock !== undefined && p.in_stock !== null ? Boolean(p.in_stock) : stockQty > 0
  const status = stockQty <= 0 ? 'out_of_stock' : (inStock ? 'active' : 'out_of_stock')

  const images: string[] = Array.isArray(p.images) && p.images.length > 0
    ? p.images
    : (p.image_url ? [p.image_url] : [])

  const primaryImageUrl = images[0] || p.image_url || null

  return {
    ...p,
    stock_quantity: stockQty,
    stock: stockQty,
    status,
    in_stock: status !== 'out_of_stock' && inStock && stockQty > 0,
    image_url: primaryImageUrl,
    images,
    category: categoryObj || p.category || (p.category_id ? { id: p.category_id, name: p.category_id, slug: p.category_id } : null),
  } as Product
}

const CANONICAL_CATEGORY_ALIASES: Record<string, string[]> = {
  '1': ['1', 'sarees', 'saree', 'Sarees'],
  'sarees': ['1', 'sarees', 'saree', 'Sarees'],
  '2': ['2', 'silk-sarees', 'silk-saree', 'silksaree', 'silk sarees', 'silk saree', 'cat-silk-saree', 'Silk Sarees'],
  'silk-sarees': ['2', 'silk-sarees', 'silk-saree', 'silksaree', 'silk sarees', 'silk saree', 'cat-silk-saree', 'Silk Sarees'],
  '3': ['3', 'cotton-sarees', 'cotton-saree', 'cottonsaree', 'cotton sarees', 'cotton saree', 'cat-cotton-saree', 'Cotton Sarees'],
  'cotton-sarees': ['3', 'cotton-sarees', 'cotton-saree', 'cottonsaree', 'cotton sarees', 'cotton saree', 'cat-cotton-saree', 'Cotton Sarees'],
  '4': ['4', 'designer-sarees', 'designer-saree', 'design-saree', 'design saree', 'designer sarees', 'crepe-saree', 'cat-design-saree', 'cat-crepe-saree', 'Designer Sarees'],
  'designer-sarees': ['4', 'designer-sarees', 'designer-saree', 'design-saree', 'design saree', 'designer sarees', 'crepe-saree', 'cat-design-saree', 'cat-crepe-saree', 'Designer Sarees'],
  '5': ['5', 'lehengas', 'lehenga', 'lehenga-choli', 'bridal-lehenga', 'cat-lehengas', 'Lehengas'],
  'lehengas': ['5', 'lehengas', 'lehenga', 'lehenga-choli', 'bridal-lehenga', 'cat-lehengas', 'Lehengas'],
  '6': ['6', 'kurtis', 'kurti', 'tops', 'cat-tops', 'ethnic-tops', 'Kurtis'],
  'kurtis': ['6', 'kurtis', 'kurti', 'tops', 'cat-tops', 'ethnic-tops', 'Kurtis'],
  '7': ['7', 'dress-materials', 'dress-material', 'salwar-suit', 'dress materials', 'cat-dress-materials', 'Dress Materials'],
  'dress-materials': ['7', 'dress-materials', 'dress-material', 'salwar-suit', 'dress materials', 'cat-dress-materials', 'Dress Materials'],
  '8': ['8', 'ethnic-wear', 'ethnic wear', 'leggings', 'cat-leggings', 'traditional-wear', 'Ethnic Wear'],
  'ethnic-wear': ['8', 'ethnic-wear', 'ethnic wear', 'leggings', 'cat-leggings', 'traditional-wear', 'Ethnic Wear'],
}

// Fetch categories map for joining with products
async function fetchCategoriesMap(): Promise<Map<string, Category>> {
  const map = new Map<string, Category>()
  try {
    const { data: dbCats } = await supabase.from('categories').select('*')
    if (dbCats && dbCats.length > 0) {
      dbCats.forEach((c) => {
        const cat: Category = {
          id: String(c.id),
          name: c.name,
          slug: c.slug,
          image: `/images/categories/${c.slug}.jpg`,
          description: c.description || null,
        }
        map.set(String(c.id), cat)
        map.set(c.slug.toLowerCase(), cat)
        map.set(c.name.toLowerCase(), cat)
      })
    }
  } catch (err: any) {
    console.warn('Failed to fetch categories map from Supabase:', err.message)
  }
  return map
}

// 1. Get Products (EXCLUSIVELY from Supabase)
export const getProductsServerFn = createServerFn({
  method: 'GET',
})
  .validator((filters: ProductFilters) => filters)
  .handler(async ({ data: filters }): Promise<PaginatedResponse<Product>> => {
    const page = filters.page || 1
    const limit = filters.limit || 12
    const from = (page - 1) * limit
    const to = from + limit - 1

    try {
      const categoriesMap = await fetchCategoriesMap()

      let query = supabase
        .from('products')
        .select('*', { count: 'exact' })

      if (filters.search) {
        const s = filters.search.trim()
        query = query.or(`name.ilike.%${s}%,description.ilike.%${s}%,fabric.ilike.%${s}%`)
      }

      if (filters.category) {
        const catKey = filters.category.toLowerCase().trim()
        const aliases = CANONICAL_CATEGORY_ALIASES[catKey] || [filters.category]
        const matched = categoriesMap.get(catKey) || categoriesMap.get(filters.category)
        const idList = new Set<string>(aliases)
        if (matched) {
          idList.add(matched.id)
          idList.add(matched.slug)
          idList.add(matched.name)
        }
        const orConditions = Array.from(idList)
          .filter(Boolean)
          .map((id) => `category_id.eq.${id}`)
          .join(',')
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

      if (error) {
        console.error('Supabase products query error:', error.message)
        throw error
      }

      const formatted = (data || []).map((p) => {
        const catObj = p.category_id
          ? categoriesMap.get(String(p.category_id)) ||
            categoriesMap.get(String(p.category_id).toLowerCase()) ||
            null
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
    } catch (err: any) {
      console.error('Error in getProductsServerFn:', err.message)
      return {
        data: [],
        total: 0,
        page,
        limit,
        hasMore: false,
      }
    }
  })

// 2. Get Product By Slug (EXCLUSIVELY from Supabase)
export const getProductBySlugServerFn = createServerFn({
  method: 'GET',
})
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }): Promise<Product | null> => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .maybeSingle()

      if (error) {
        console.error('Supabase getProductBySlug error:', error.message)
        return null
      }

      if (!data) return null

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
    } catch (err: any) {
      console.error('Error in getProductBySlugServerFn:', err.message)
      return null
    }
  })

// 3. Get Featured Products (EXCLUSIVELY from Supabase)
export const getFeaturedProductsServerFn = createServerFn({
  method: 'GET',
}).handler(async (): Promise<Product[]> => {
  try {
    const categoriesMap = await fetchCategoriesMap()
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('featured', true)
      .order('created_at', { ascending: false })
      .limit(8)

    if (error) throw error
    return (data || []).map((p) => {
      const catObj = p.category_id ? categoriesMap.get(p.category_id) || categoriesMap.get(p.category_id.toLowerCase()) : null
      return formatProductRecord(p, catObj)
    })
  } catch (err: any) {
    console.error('Error in getFeaturedProductsServerFn:', err.message)
    return []
  }
})

// 4. Get Best Sellers (EXCLUSIVELY from Supabase)
export const getBestSellersServerFn = createServerFn({
  method: 'GET',
}).handler(async (): Promise<Product[]> => {
  try {
    const categoriesMap = await fetchCategoriesMap()
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('best_seller', true)
      .order('created_at', { ascending: false })
      .limit(8)

    if (error) throw error
    return (data || []).map((p) => {
      const catObj = p.category_id ? categoriesMap.get(p.category_id) || categoriesMap.get(p.category_id.toLowerCase()) : null
      return formatProductRecord(p, catObj)
    })
  } catch (err: any) {
    console.error('Error in getBestSellersServerFn:', err.message)
    return []
  }
})

// 5. Get New Arrivals (EXCLUSIVELY from Supabase)
export const getNewArrivalsServerFn = createServerFn({
  method: 'GET',
}).handler(async (): Promise<Product[]> => {
  try {
    const categoriesMap = await fetchCategoriesMap()
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('new_arrival', true)
      .order('created_at', { ascending: false })
      .limit(8)

    if (error) throw error
    return (data || []).map((p) => {
      const catObj = p.category_id ? categoriesMap.get(p.category_id) || categoriesMap.get(p.category_id.toLowerCase()) : null
      return formatProductRecord(p, catObj)
    })
  } catch (err: any) {
    console.error('Error in getNewArrivalsServerFn:', err.message)
    return []
  }
})

// 6. Get Festival Products (EXCLUSIVELY from Supabase)
export const getFestivalProductsServerFn = createServerFn({
  method: 'GET',
}).handler(async (): Promise<Product[]> => {
  try {
    const categoriesMap = await fetchCategoriesMap()
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(8)

    if (error) throw error
    return (data || []).map((p) => {
      const catObj = p.category_id ? categoriesMap.get(p.category_id) || categoriesMap.get(p.category_id.toLowerCase()) : null
      return formatProductRecord(p, catObj)
    })
  } catch (err: any) {
    console.error('Error in getFestivalProductsServerFn:', err.message)
    return []
  }
})

// 7. Get Related Products (EXCLUSIVELY from Supabase)
export const getRelatedProductsServerFn = createServerFn({
  method: 'GET',
})
  .validator((data: { productId: string; categoryId?: string }) => data)
  .handler(async ({ data: { productId, categoryId } }): Promise<Product[]> => {
    try {
      const categoriesMap = await fetchCategoriesMap()
      let query = supabase.from('products').select('*').neq('id', productId).limit(4)
      if (categoryId) {
        query = query.eq('category_id', categoryId)
      }
      const { data, error } = await query
      if (error) throw error

      return (data || []).map((p) => {
        const catObj = p.category_id ? categoriesMap.get(p.category_id) || categoriesMap.get(p.category_id.toLowerCase()) : null
        return formatProductRecord(p, catObj)
      })
    } catch (err: any) {
      console.error('Error in getRelatedProductsServerFn:', err.message)
      return []
    }
  })

// 8. Create Product (EXCLUSIVELY in Supabase)
export const createProductServerFn = createServerFn({
  method: 'POST',
})
  .validator((product: Partial<Product>) => product)
  .handler(async ({ data: product }): Promise<Product> => {
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

    const { data, error } = await supabase
      .from('products')
      .insert(insertData)
      .select()
      .single()

    if (error) {
      console.error('Supabase create product error:', error.message)
      throw new Error(error.message)
    }

    return formatProductRecord(data)
  })

// 9. Update Product (EXCLUSIVELY in Supabase)
export const updateProductServerFn = createServerFn({
  method: 'POST',
})
  .validator((data: { id: string; updates: Partial<Product> }) => data)
  .handler(async ({ data: { id, updates } }): Promise<Product> => {
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

    const { data, error } = await supabase
      .from('products')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Supabase update product error:', error.message)
      throw new Error(error.message)
    }

    return formatProductRecord(data)
  })

// 10. Delete Product (Deletes Associated Supabase Storage Images first, then deletes DB row)
export const deleteProductServerFn = createServerFn({
  method: 'POST',
})
  .validator((id: string) => id)
  .handler(async ({ data: id }): Promise<void> => {
    // 1. Fetch product first to get all associated image URLs
    try {
      const { data: prod } = await supabase
        .from('products')
        .select('images')
        .eq('id', id)
        .maybeSingle()

      if (prod && Array.isArray(prod.images) && prod.images.length > 0) {
        await deleteProductImages(prod.images)
      }
    } catch (storageErr: any) {
      console.warn('Notice while cleaning up storage images for product delete:', storageErr.message)
    }

    // 2. Delete the record from products table in Supabase Database
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) {
      console.error('Supabase delete product error:', error.message)
      throw new Error(error.message)
    }
  })
