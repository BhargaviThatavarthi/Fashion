import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import type { Product, Category, Collection, Testimonial, YoutubeVideo, ProductFilters, PaginatedResponse } from '../types'

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID || ''
const dataset = import.meta.env.VITE_SANITY_DATASET || 'production'
const apiVersion = import.meta.env.VITE_SANITY_API_VERSION || '2023-01-01'

export const isSanityConfigured = (): boolean => {
  return Boolean(import.meta.env.VITE_SANITY_PROJECT_ID)
}

export const sanityClient = createClient({
  projectId: projectId || 'placeholder',
  dataset,
  apiVersion,
  useCdn: true,
})

const builder = imageUrlBuilder({
  projectId: projectId || 'placeholder',
  dataset,
})

export function urlFor(source: any) {
  if (!source) return null
  if (typeof source === 'string') return source
  try {
    return builder.image(source).url()
  } catch (err) {
    return null
  }
}

// ----------------------------------------------------
// 1. HERO BANNER DATA & GROQ QUERY
// ----------------------------------------------------
export interface HeroBannerData {
  brandTitle?: string
  brandSubtitle?: string
  headline?: string
  subheadline?: string
  features?: string[]
  description?: string
  buttonText?: string
  buttonLink?: string
  heroImageUrl?: string
  stats?: Array<{
    num: string
    label: string
  }>
}

export const DEFAULT_HERO_BANNER: HeroBannerData = {
  brandTitle: 'Sri Subhakari Fashions',
  brandSubtitle: 'New Collection',
  headline: 'ELEGANCE',
  subheadline: 'IN EVERY THREAD',
  features: ['Premium Quality', 'Soft Fabric', 'Timeless Style'],
  description:
    'Discover all the beautiful collections at Sri Subhakari Fashions, featuring elegant handloom silk sarees, designer lehengas, and timeless ethnic wear. Explore our stunning styles and shop now to find the perfect outfit for every special occasion.',
  buttonText: 'SHOP NOW',
  buttonLink: '/shop',
  heroImageUrl: '/images/hero-galaxy-dress-nobg.png',
  stats: [
    { num: '5000+', label: 'Happy Customers' },
    { num: '200+', label: '3D Designs' },
    { num: '10+', label: 'Years of Trust' },
  ],
}

export async function fetchHeroBanner(): Promise<HeroBannerData> {
  if (!isSanityConfigured()) {
    return DEFAULT_HERO_BANNER
  }

  try {
    const query = `*[_type == "heroBanner"][0]{
      brandTitle,
      brandSubtitle,
      headline,
      subheadline,
      features,
      description,
      buttonText,
      buttonLink,
      "heroImageUrl": heroImage.asset->url,
      stats[] {
        num,
        label
      }
    }`

    const data = await sanityClient.fetch<HeroBannerData>(query)
    if (!data) return DEFAULT_HERO_BANNER

    return {
      brandTitle: data.brandTitle || DEFAULT_HERO_BANNER.brandTitle,
      brandSubtitle: data.brandSubtitle || DEFAULT_HERO_BANNER.brandSubtitle,
      headline: data.headline || DEFAULT_HERO_BANNER.headline,
      subheadline: data.subheadline || DEFAULT_HERO_BANNER.subheadline,
      features: data.features && data.features.length > 0 ? data.features : DEFAULT_HERO_BANNER.features,
      description: data.description || DEFAULT_HERO_BANNER.description,
      buttonText: data.buttonText || DEFAULT_HERO_BANNER.buttonText,
      buttonLink: data.buttonLink || DEFAULT_HERO_BANNER.buttonLink,
      heroImageUrl: data.heroImageUrl || DEFAULT_HERO_BANNER.heroImageUrl,
      stats: data.stats && data.stats.length > 0 ? data.stats : DEFAULT_HERO_BANNER.stats,
    }
  } catch (error) {
    console.warn('Failed to fetch Hero Banner from Sanity, using fallback:', error)
    return DEFAULT_HERO_BANNER
  }
}

// Helper to normalize product images and relations from Sanity
function transformSanityProduct(item: any): Product {
  const imageUrls: string[] = []

  if (item.images && Array.isArray(item.images)) {
    item.images.forEach((img: any) => {
      if (typeof img === 'string') {
        imageUrls.push(img)
      } else if (img?.asset?.url) {
        imageUrls.push(img.asset.url)
      } else if (img) {
        const built = urlFor(img)
        if (built) imageUrls.push(built)
      }
    })
  }

  const collections: Collection[] = []
  if (item.collections && Array.isArray(item.collections)) {
    item.collections.forEach((col: any) => {
      if (col && (col.title || col.name)) {
        collections.push({
          id: col._id || col.id,
          title: col.title || col.name || '',
          slug: col.slug?.current || col.slug || '',
          badge: col.badge || null,
          subtitle: col.subtitle || null,
          description: col.description || null,
          image: col.image?.asset?.url || col.image || null,
          order: col.order || 0,
          show_on_homepage: col.showOnHomepage ?? true,
          view_all_label: col.viewAllLabel || null,
        })
      }
    })
  }

  const isFeatured = item.featured || collections.some((c) => c.slug === 'featured-sarees' || c.slug === 'featured')
  const isBestSeller = item.best_seller || collections.some((c) => c.slug === 'best-sellers' || c.slug === 'best_seller')
  const isNewArrival = item.new_arrival || collections.some((c) => c.slug === 'new-arrivals' || c.slug === 'new_arrival')

  return {
    id: item._id || item.id,
    name: item.name || '',
    slug: item.slug?.current || item.slug || '',
    description: item.description || '',
    price: item.price || 0,
    offer_price: item.offer_price || null,
    category_id: item.category?._id || item.category_id || null,
    category: item.category
      ? {
          id: item.category._id || item.category.id,
          name: item.category.name,
          slug: item.category.slug?.current || item.category.slug || '',
          description: item.category.description || null,
          image: item.category.image?.asset?.url || item.category.image || null,
          order: item.category.order || 0,
        }
      : null,
    collections: collections.length > 0 ? collections : null,
    fabric: item.fabric || null,
    color: item.color || [],
    sizes: item.sizes || [],
    sku: item.sku || null,
    wash_care: item.wash_care || null,
    rating: item.rating || 5,
    review_count: item.review_count || 0,
    stock: item.stock ?? 10,
    in_stock: item.in_stock ?? true,
    featured: isFeatured,
    best_seller: isBestSeller,
    new_arrival: isNewArrival,
    tags: item.tags || [],
    images: imageUrls,
    created_at: item._createdAt,
    updated_at: item._updatedAt,
  }
}

// ----------------------------------------------------
// 2. CATEGORIES GROQ QUERIES
// ----------------------------------------------------
export async function fetchCategoriesFromSanity(): Promise<Category[]> {
  if (!isSanityConfigured()) return []

  try {
    const query = `*[_type == "category"] | order(order asc, name asc) {
      _id,
      name,
      slug,
      description,
      order,
      "image": image.asset->url,
      _createdAt
    }`

    const raw = await sanityClient.fetch<any[]>(query)
    return (raw || []).map((cat) => ({
      id: cat._id,
      name: cat.name,
      slug: cat.slug?.current || cat.slug,
      description: cat.description || null,
      order: cat.order || 0,
      image: cat.image || null,
      created_at: cat._createdAt,
    }))
  } catch (error) {
    console.warn('Failed to fetch categories from Sanity:', error)
    return []
  }
}

export async function fetchCategoryBySlugFromSanity(slug: string): Promise<Category | null> {
  if (!isSanityConfigured()) return null

  try {
    const query = `*[_type == "category" && slug.current == $slug][0]{
      _id,
      name,
      slug,
      description,
      order,
      "image": image.asset->url,
      _createdAt
    }`

    const cat = await sanityClient.fetch<any>(query, { slug })
    if (!cat) return null

    return {
      id: cat._id,
      name: cat.name,
      slug: cat.slug?.current || cat.slug,
      description: cat.description || null,
      order: cat.order || 0,
      image: cat.image || null,
      created_at: cat._createdAt,
    }
  } catch (error) {
    console.warn(`Failed to fetch category with slug "${slug}" from Sanity:`, error)
    return null
  }
}

// ----------------------------------------------------
// 3. COLLECTIONS GROQ QUERIES
// ----------------------------------------------------
export async function fetchCollectionsFromSanity(): Promise<Collection[]> {
  if (!isSanityConfigured()) return []

  try {
    const query = `*[_type == "collection"] | order(order asc, title asc) {
      _id,
      title,
      slug,
      badge,
      subtitle,
      description,
      order,
      showOnHomepage,
      viewAllLabel,
      "image": image.asset->url,
      _createdAt
    }`

    const raw = await sanityClient.fetch<any[]>(query)
    return (raw || []).map((col) => ({
      id: col._id,
      title: col.title || col.name,
      slug: col.slug?.current || col.slug,
      badge: col.badge || null,
      subtitle: col.subtitle || null,
      description: col.description || null,
      order: col.order || 0,
      show_on_homepage: col.showOnHomepage ?? true,
      view_all_label: col.viewAllLabel || null,
      image: col.image || null,
      created_at: col._createdAt,
    }))
  } catch (error) {
    console.warn('Failed to fetch collections from Sanity:', error)
    return []
  }
}

export async function fetchCollectionBySlugFromSanity(slug: string): Promise<Collection | null> {
  if (!isSanityConfigured()) return null

  try {
    const query = `*[_type == "collection" && slug.current == $slug][0]{
      _id,
      title,
      slug,
      badge,
      subtitle,
      description,
      order,
      showOnHomepage,
      viewAllLabel,
      "image": image.asset->url,
      _createdAt
    }`

    const col = await sanityClient.fetch<any>(query, { slug })
    if (!col) return null

    return {
      id: col._id,
      title: col.title || col.name,
      slug: col.slug?.current || col.slug,
      badge: col.badge || null,
      subtitle: col.subtitle || null,
      description: col.description || null,
      order: col.order || 0,
      show_on_homepage: col.showOnHomepage ?? true,
      view_all_label: col.viewAllLabel || null,
      image: col.image || null,
      created_at: col._createdAt,
    }
  } catch (error) {
    console.warn(`Failed to fetch collection with slug "${slug}" from Sanity:`, error)
    return null
  }
}

// ----------------------------------------------------
// 4. PRODUCTS GROQ QUERIES & FETCHERS
// ----------------------------------------------------
export async function fetchProductsFromSanity(
  filters: ProductFilters = {}
): Promise<PaginatedResponse<Product>> {
  if (!isSanityConfigured()) return { data: [], total: 0, page: 1, limit: 12, hasMore: false }

  try {
    const conditions: string[] = ['_type == "product"']

    if (filters.search) {
      conditions.push(`(name match "*${filters.search}*" || description match "*${filters.search}*" || category->name match "*${filters.search}*")`)
    }
    if (filters.category) {
      conditions.push(`(category->slug.current == "${filters.category}" || category->_id == "${filters.category}")`)
    }
    if (filters.collection) {
      // Check collection reference slug or ID, with fallback to legacy boolean flags
      const colSlug = filters.collection
      conditions.push(
        `("${colSlug}" in collections[]->slug.current || "${colSlug}" in collections[]->_id || ("${colSlug}" in ["featured-sarees", "featured"] && featured == true) || ("${colSlug}" in ["new-arrivals", "new_arrival"] && new_arrival == true) || ("${colSlug}" in ["best-sellers", "best_seller"] && best_seller == true))`
      )
    }
    if (filters.fabric) {
      conditions.push(`fabric == "${filters.fabric}"`)
    }
    if (filters.featured) {
      conditions.push('("featured-sarees" in collections[]->slug.current || featured == true)')
    }
    if (filters.bestSeller) {
      conditions.push('("best-sellers" in collections[]->slug.current || best_seller == true)')
    }
    if (filters.newArrival) {
      conditions.push('("new-arrivals" in collections[]->slug.current || new_arrival == true)')
    }
    if (filters.minPrice !== undefined) {
      conditions.push(`(coalesce(offer_price, price) >= ${filters.minPrice})`)
    }
    if (filters.maxPrice !== undefined) {
      conditions.push(`(coalesce(offer_price, price) <= ${filters.maxPrice})`)
    }

    const whereClause = conditions.join(' && ')
    
    let orderClause = '_createdAt desc'
    if (filters.sortBy === 'price_asc') orderClause = 'price asc'
    if (filters.sortBy === 'price_desc') orderClause = 'price desc'
    if (filters.sortBy === 'popular') orderClause = 'rating desc'

    const page = filters.page || 1
    const limit = filters.limit || 12
    const start = (page - 1) * limit
    const end = start + limit

    const countQuery = `count(*[${whereClause}])`
    const dataQuery = `*[${whereClause}] | order(${orderClause}) [${start}...${end}] {
      ...,
      category->{
        _id,
        name,
        slug,
        description,
        order,
        "image": image.asset->url
      },
      collections[]->{
        _id,
        title,
        slug,
        badge,
        subtitle,
        description,
        order,
        showOnHomepage,
        viewAllLabel,
        "image": image.asset->url
      },
      images[] {
        ...,
        "asset": asset->
      }
    }`

    const [total, rawProducts] = await Promise.all([
      sanityClient.fetch<number>(countQuery),
      sanityClient.fetch<any[]>(dataQuery),
    ])

    const products = (rawProducts || []).map(transformSanityProduct)

    return {
      data: products,
      total: total || 0,
      page,
      limit,
      hasMore: start + products.length < total,
    }
  } catch (error) {
    console.warn('Failed to fetch products from Sanity:', error)
    return { data: [], total: 0, page: 1, limit: 12, hasMore: false }
  }
}

export async function fetchProductBySlugFromSanity(slug: string): Promise<Product | null> {
  if (!isSanityConfigured()) return null

  try {
    const query = `*[_type == "product" && slug.current == $slug][0]{
      ...,
      category->{
        _id,
        name,
        slug,
        description,
        order,
        "image": image.asset->url
      },
      collections[]->{
        _id,
        title,
        slug,
        badge,
        subtitle,
        description,
        order,
        showOnHomepage,
        viewAllLabel,
        "image": image.asset->url
      },
      images[] {
        ...,
        "asset": asset->
      }
    }`

    const raw = await sanityClient.fetch<any>(query, { slug })
    if (!raw) return null

    return transformSanityProduct(raw)
  } catch (error) {
    console.warn(`Failed to fetch product with slug "${slug}" from Sanity:`, error)
    return null
  }
}

export async function fetchFeaturedProductsFromSanity(limit = 8): Promise<Product[]> {
  const res = await fetchProductsFromSanity({ collection: 'featured-sarees', featured: true, limit })
  return res.data
}

export async function fetchBestSellersFromSanity(limit = 8): Promise<Product[]> {
  const res = await fetchProductsFromSanity({ collection: 'best-sellers', bestSeller: true, limit })
  return res.data
}

export async function fetchNewArrivalsFromSanity(limit = 8): Promise<Product[]> {
  const res = await fetchProductsFromSanity({ collection: 'new-arrivals', newArrival: true, limit })
  return res.data
}

export async function fetchFestivalProductsFromSanity(limit = 8): Promise<Product[]> {
  const res = await fetchProductsFromSanity({ collection: 'festival-collections', limit })
  return res.data
}

// ----------------------------------------------------
// 5. TESTIMONIALS GROQ QUERY
// ----------------------------------------------------
export async function fetchTestimonialsFromSanity(): Promise<Testimonial[]> {
  if (!isSanityConfigured()) return []

  try {
    const query = `*[_type == "testimonial"] | order(_createdAt desc) {
      _id,
      customer_name,
      review,
      rating,
      "image": image.asset->url
    }`

    const raw = await sanityClient.fetch<any[]>(query)
    return (raw || []).map((t) => ({
      id: t._id,
      customer_name: t.customer_name,
      review: t.review,
      rating: t.rating || 5,
      image: t.image || null,
      created_at: t._createdAt,
    }))
  } catch (error) {
    console.warn('Failed to fetch testimonials from Sanity:', error)
    return []
  }
}

// ----------------------------------------------------
// 6. YOUTUBE VIDEOS GROQ QUERY
// ----------------------------------------------------
export async function fetchYoutubeVideosFromSanity(): Promise<YoutubeVideo[]> {
  if (!isSanityConfigured()) return []

  try {
    const query = `*[_type == "youtubeVideo"] | order(_createdAt desc) {
      _id,
      title,
      video_id,
      "thumbnail": thumbnail.asset->url
    }`

    const raw = await sanityClient.fetch<any[]>(query)
    return (raw || []).map((v) => ({
      id: v._id,
      title: v.title,
      video_id: v.video_id,
      thumbnail: v.thumbnail || null,
      created_at: v._createdAt,
    }))
  } catch (error) {
    console.warn('Failed to fetch youtube videos from Sanity:', error)
    return []
  }
}

// ----------------------------------------------------
// 7. SITE SETTINGS GROQ QUERY
// ----------------------------------------------------
export async function fetchSiteSettingsFromSanity(): Promise<any | null> {
  if (!isSanityConfigured()) return null

  try {
    const query = `*[_type == "siteSettings"][0]`
    return await sanityClient.fetch<any>(query)
  } catch (error) {
    console.warn('Failed to fetch site settings from Sanity:', error)
    return null
  }
}
