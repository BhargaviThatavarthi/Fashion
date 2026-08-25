import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { Search, SlidersHorizontal, X, ChevronDown, Check, Tag, Sparkles, ArrowRight, RotateCcw } from 'lucide-react'
import ProductCard from '../components/shop/ProductCard'
import { Skeleton } from '../components/ui/skeleton'
import { getProducts } from '../services/products'
import { getCategories } from '../services/categories'
import { getCollections } from '../services/collections'
import { FABRIC_OPTIONS, SORT_OPTIONS } from '../constants'
import { STATIC_CATEGORIES, getStaticCategory } from '../constants/categories'
import type { ProductFilters, Category, Collection } from '../types'

type ShopSearch = {
  search?: string
  category?: string
  collection?: string
  fabric?: string
  sortBy?: string
  maxPrice?: number
  minPrice?: number
}

export const Route = createFileRoute('/shop/')({
  validateSearch: (search: Record<string, unknown>): ShopSearch => ({
    search: typeof search.search === 'string' ? search.search : undefined,
    category: typeof search.category === 'string' ? search.category : undefined,
    collection: typeof search.collection === 'string' ? search.collection : undefined,
    fabric: typeof search.fabric === 'string' ? search.fabric : undefined,
    sortBy: typeof search.sortBy === 'string' ? search.sortBy : undefined,
    maxPrice: typeof search.maxPrice === 'number' ? search.maxPrice : (typeof search.maxPrice === 'string' ? Number(search.maxPrice) : undefined),
    minPrice: typeof search.minPrice === 'number' ? search.minPrice : (typeof search.minPrice === 'string' ? Number(search.minPrice) : undefined),
  }),
  loaderDeps: ({ search: { search, category, collection, fabric, sortBy, maxPrice, minPrice } }) => ({
    search,
    category,
    collection,
    fabric,
    sortBy,
    maxPrice,
    minPrice,
  }),
  loader: async ({ context: { queryClient }, deps }) => {
    const filters = {
      search: deps.search || '',
      category: deps.category || '',
      collection: deps.collection || '',
      fabric: deps.fabric || '',
      maxPrice: deps.maxPrice,
      minPrice: deps.minPrice,
      sortBy: (deps.sortBy as any) || 'latest',
      page: 1,
      limit: 12,
    }
    try {
      await Promise.all([
        queryClient.ensureQueryData({
          queryKey: ['products', filters],
          queryFn: () => getProducts(filters),
        }),
        queryClient.ensureQueryData({
          queryKey: ['categories'],
          queryFn: getCategories,
        }),
        queryClient.ensureQueryData({
          queryKey: ['collections'],
          queryFn: getCollections,
        }),
      ])
    } catch (err: any) {
      console.warn('Shop route loader notice:', err?.message || err)
    }
  },
  head: () => ({
    meta: [
      { title: 'Shop All Products — Sri Subhakari Fashions' },
      {
        name: 'description',
        content:
          'Browse our complete collection of sarees, silk sarees, kurtis, 3pc sets, lehengas, and ethnic wear. Filter by category, collection, fabric, price and more.',
      },
    ],
  }),
  component: ShopPage,
})

function ProductSkeleton() {
  return (
    <div className="premium-card bg-white rounded-2xl overflow-hidden shadow-xs border border-gray-100">
      <Skeleton className="aspect-[3/4] w-full" style={{ background: '#F3F4F6' }} />
      <div className="p-4 space-y-2">
        <Skeleton className="h-3 w-20" style={{ background: '#E5E7EB' }} />
        <Skeleton className="h-5 w-full" style={{ background: '#E5E7EB' }} />
        <Skeleton className="h-6 w-24" style={{ background: '#E5E7EB' }} />
        <div className="flex gap-2">
          <Skeleton className="h-8 flex-1 rounded-full" style={{ background: '#E5E7EB' }} />
          <Skeleton className="h-8 w-20 rounded-full" style={{ background: '#E5E7EB' }} />
        </div>
      </div>
    </div>
  )
}

export default function ShopPage() {
  const navigate = useNavigate()
  const routeSearch = Route.useSearch()
  const [filters, setFilters] = useState<ProductFilters>({
    search: routeSearch.search || '',
    category: routeSearch.category || '',
    collection: routeSearch.collection || '',
    fabric: routeSearch.fabric || '',
    maxPrice: routeSearch.maxPrice,
    minPrice: routeSearch.minPrice,
    sortBy: (routeSearch.sortBy as any) || 'latest',
    page: 1,
    limit: 12,
  })
  const [showFilters, setShowFilters] = useState(false)
  const [showMobileSidebar, setShowMobileSidebar] = useState(false)
  const [searchInput, setSearchInput] = useState(routeSearch.search || '')

  // Synchronize state with URL search params
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      search: routeSearch.search || '',
      category: routeSearch.category || '',
      collection: routeSearch.collection || '',
      fabric: routeSearch.fabric || '',
      maxPrice: routeSearch.maxPrice,
      minPrice: routeSearch.minPrice,
      sortBy: (routeSearch.sortBy as any) || prev.sortBy,
      page: 1,
    }))
    if (routeSearch.search !== undefined) {
      setSearchInput(routeSearch.search || '')
    }
  }, [
    routeSearch.search,
    routeSearch.category,
    routeSearch.collection,
    routeSearch.fabric,
    routeSearch.sortBy,
    routeSearch.maxPrice,
    routeSearch.minPrice,
  ])

  const { data: productsData, isLoading } = useQuery({
    queryKey: ['products', filters],
    queryFn: () => getProducts(filters),
    staleTime: 0,
  })

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: 10 * 60 * 1000,
  })

  const { data: collections = [] } = useQuery<Collection[]>({
    queryKey: ['collections'],
    queryFn: getCollections,
    staleTime: 10 * 60 * 1000,
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((f) => ({ ...f, search: searchInput, page: 1 }))
    }, 400)
    return () => clearTimeout(timer)
  }, [searchInput])

  const updateFilter = (key: keyof ProductFilters, value: any) => {
    setFilters((f) => ({ ...f, [key]: value, page: 1 }))
    navigate({
      search: (prev: any) => {
        const next = { ...prev, [key]: value || undefined }
        if (value === undefined || value === '' || value === null) delete next[key]
        return next
      },
      replace: true,
    })
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      collection: '',
      fabric: '',
      maxPrice: undefined,
      minPrice: undefined,
      sortBy: 'latest',
      page: 1,
      limit: 12,
    })
    setSearchInput('')
    navigate({
      search: {},
      replace: true,
    })
  }

  const products = productsData?.data || []
  const total = productsData?.total || 0

  // 1. Image 1 Reference Categories List (with radio checkmark & count badge)
  const REFERENCE_CATEGORIES = [
    { id: 'all', label: 'Shop All', type: 'all' as const, count: 209 },
    { id: '3pc-kurta-sets', label: '3Pc Kurta Sets', type: 'category' as const, slug: '3pc-kurta-sets', count: 108 },
    { id: '2-piece-sets', label: '2 Piece Sets', type: 'category' as const, slug: '2-piece-sets', count: 66 },
    { id: 'kurtis', label: "Kurti's", type: 'category' as const, slug: 'kurtis', count: 24 },
    { id: 'dress-materials', label: 'Dress materials', type: 'category' as const, slug: 'dress-materials', count: 20 },
    { id: 'top-349', label: 'Top 349', type: 'price' as const, maxPrice: 499, slug: 'tops', count: 1 },
    { id: 'sale-999', label: 'SALE - 999/-', type: 'price' as const, maxPrice: 999, count: 3 },
    { id: 'budget-friendly', label: 'Budget Friendly', type: 'price' as const, maxPrice: 1999, count: 79 },
    { id: 'new-arrivals', label: 'New Arrivals', type: 'collection' as const, slug: 'new-arrivals', count: 201 },
  ]

  // 2. Image 2 Canonical Categories List (Sarees & Ethnic Wear)
  const BOUTIQUE_CATEGORIES = [
    { id: 'sarees', label: 'Sarees', slug: 'sarees', count: 142 },
    { id: 'silk-sarees', label: 'Silk Sarees', slug: 'silk-sarees', count: 54 },
    { id: 'cotton-sarees', label: 'Cotton Sarees', slug: 'cotton-sarees', count: 48 },
    { id: 'designer-sarees', label: 'Designer Sarees', slug: 'designer-sarees', count: 40 },
    { id: 'lehengas', label: 'Lehengas', slug: 'lehengas', count: 18 },
    { id: 'kurtis', label: 'Kurtis', slug: 'kurtis', count: 24 },
    { id: 'dress-materials', label: 'Dress Materials', slug: 'dress-materials', count: 20 },
    { id: 'ethnic-wear', label: 'Ethnic Wear', slug: 'ethnic-wear', count: 32 },
  ]

  // 3. Image 2 Collections & Sections List
  const SECTION_COLLECTIONS = [
    { id: 'featured-sarees', label: 'Featured Sarees', slug: 'featured-sarees', count: 38 },
    { id: 'new-arrivals', label: 'New Arrivals', slug: 'new-arrivals', count: 201 },
    { id: 'best-sellers', label: 'Best Sellers', slug: 'best-sellers', count: 45 },
    { id: 'festival-collections', label: 'Festival Collections', slug: 'festival-collections', count: 62 },
  ]

  // Handler for clicking any category / deal item in sidebar
  const handleSelectItem = (item: {
    id: string
    type: 'all' | 'category' | 'collection' | 'price'
    slug?: string
    maxPrice?: number
  }) => {
    if (item.type === 'all') {
      clearFilters()
      setShowMobileSidebar(false)
      return
    }

    if (item.type === 'category' && item.slug) {
      const isAlready = filters.category === item.slug
      updateFilter('category', isAlready ? '' : item.slug)
      if (!isAlready) {
        updateFilter('collection', '')
        updateFilter('maxPrice', undefined)
      }
    } else if (item.type === 'collection' && item.slug) {
      const isAlready = filters.collection === item.slug
      updateFilter('collection', isAlready ? '' : item.slug)
      if (!isAlready) {
        updateFilter('category', '')
        updateFilter('maxPrice', undefined)
      }
    } else if (item.type === 'price' && item.maxPrice) {
      const isAlready = filters.maxPrice === item.maxPrice
      updateFilter('maxPrice', isAlready ? undefined : item.maxPrice)
      if (item.slug && !isAlready) {
        updateFilter('category', item.slug)
      }
      updateFilter('collection', '')
    }

    setShowMobileSidebar(false)
  }

  // Active Category or Collection details for dynamic Header
  const activeCategory =
    getStaticCategory(filters.category) ||
    categories.find(
      (c) =>
        c.slug.toLowerCase() === (filters.category || '').toLowerCase() ||
        c.id === filters.category ||
        c.name.toLowerCase() === (filters.category || '').toLowerCase(),
    )
  const activeCollection = collections.find((c) => c.slug === filters.collection || c.id === filters.collection)

  let pageTitle = 'Shop All Products'
  let pageBadge = 'Our Collection'
  let pageSubtitle = `${total} Products available`

  if (activeCollection) {
    pageTitle = activeCollection.title
    pageBadge = activeCollection.badge?.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '').trim() || 'Featured Collection'
    pageSubtitle = activeCollection.subtitle || `${total} Products in ${activeCollection.title}`
  } else if (activeCategory) {
    pageTitle = activeCategory.name
    pageBadge = 'Product Category'
    pageSubtitle = activeCategory.description || `Explore our handpicked ${activeCategory.name} collection (${total} available)`
  } else if (filters.maxPrice) {
    pageTitle = `Under ₹${filters.maxPrice}`
    pageBadge = 'Special Offer'
    pageSubtitle = `Handpicked styles under ₹${filters.maxPrice}`
  }

  const hasActiveFilters = Boolean(
    filters.category ||
    filters.collection ||
    filters.fabric ||
    filters.maxPrice ||
    filters.minPrice ||
    filters.search
  )

  // Reusable Category Sidebar Content (Rendered in Desktop & Mobile Drawer)
  const SidebarContent = () => (
    <div className="space-y-6">
      {/* 1. Main Product Categories (Styled exactly like Image 1) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading font-bold text-xl text-gray-900 tracking-tight">
            Product categories
          </h3>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-xs font-nav text-pink-600 hover:text-pink-800 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw size={12} /> Reset
            </button>
          )}
        </div>

        <div className="space-y-3">
          {REFERENCE_CATEGORIES.map((item) => {
            const isSelected =
              item.type === 'all'
                ? !filters.category && !filters.collection && !filters.maxPrice && !filters.fabric && !filters.search
                : item.type === 'category'
                  ? filters.category === item.slug || (item.slug === 'kurtis' && (filters.category === 'tops' || filters.category === 'kurtis'))
                  : item.type === 'collection'
                    ? filters.collection === item.slug
                    : item.type === 'price'
                      ? filters.maxPrice === item.maxPrice
                      : false

            return (
              <button
                key={item.id}
                onClick={() => handleSelectItem(item)}
                className="flex items-center w-full text-left py-1 group cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  {/* Selection Indicator (Radio / Checkmark circle matching Image 1) */}
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center transition-all shrink-0 ${
                      isSelected
                        ? 'bg-black text-white shadow-xs'
                        : 'border-2 border-gray-400 group-hover:border-black'
                    }`}
                  >
                    {isSelected && <Check size={11} strokeWidth={3.5} />}
                  </div>

                  <span
                    className={`text-[15px] transition-colors ${
                      isSelected
                        ? 'font-bold text-black'
                        : 'text-black font-normal group-hover:font-medium'
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200/80" />

      {/* 2. Sarees & Ethnic Wear Categories (From Image 2) */}
      <div>
        <h4 className="text-xs font-nav font-bold text-gray-500 uppercase tracking-wider mb-3.5">
          Sarees &amp; Ethnic Wear
        </h4>
        <div className="space-y-3">
          {BOUTIQUE_CATEGORIES.map((cat) => {
            const isSelected =
              filters.category === cat.slug ||
              (cat.slug === 'sarees' && filters.category === 'sarees')

            return (
              <button
                key={`boutique-${cat.id}`}
                onClick={() => handleSelectItem({ id: cat.id, type: 'category', slug: cat.slug })}
                className="flex items-center w-full text-left py-0.5 group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center transition-all shrink-0 ${
                      isSelected
                        ? 'bg-black text-white shadow-xs'
                        : 'border-2 border-gray-400 group-hover:border-black'
                    }`}
                  >
                    {isSelected && <Check size={11} strokeWidth={3.5} />}
                  </div>
                  <span
                    className={`text-[15px] transition-colors ${
                      isSelected
                        ? 'font-bold text-black'
                        : 'text-black font-normal group-hover:font-medium'
                    }`}
                  >
                    {cat.label}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200/80" />

      {/* 3. Collections & Highlights (From Image 2) */}
      <div>
        <h4 className="text-xs font-nav font-bold text-gray-400 uppercase tracking-wider mb-3.5">
          Collections &amp; Sections
        </h4>
        <div className="space-y-3">
          {SECTION_COLLECTIONS.map((col) => {
            const isSelected = filters.collection === col.slug

            return (
              <button
                key={`sec-${col.id}`}
                onClick={() => handleSelectItem({ id: col.id, type: 'collection', slug: col.slug })}
                className="flex items-center w-full text-left py-0.5 group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center transition-all shrink-0 ${
                      isSelected
                        ? 'bg-black text-white shadow-xs'
                        : 'border-2 border-gray-400 group-hover:border-black'
                    }`}
                  >
                    {isSelected && <Check size={11} strokeWidth={3.5} />}
                  </div>
                  <span
                    className={`text-[15px] transition-colors ${
                      isSelected
                        ? 'font-bold text-black'
                        : 'text-black font-normal group-hover:font-medium'
                    }`}
                  >
                    {col.label}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200/80" />

      {/* 4. Fabric Quick Filter */}
      <div>
        <h4 className="text-xs font-nav font-bold text-gray-400 uppercase tracking-wider mb-2.5">
          Filter by Fabric
        </h4>
        <select
          value={filters.fabric || ''}
          onChange={(e) => updateFilter('fabric', e.target.value)}
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-pink-400 cursor-pointer"
        >
          <option value="">All Fabrics</option>
          {FABRIC_OPTIONS.map((fab) => (
            <option key={fab} value={fab}>
              {fab}
            </option>
          ))}
        </select>
      </div>
    </div>
  )

  return (
    <div style={{ background: 'var(--color-bg)', minHeight: '100vh' }}>
      {/* Page Header */}
      <div className="py-10 md:py-14 text-center" style={{ background: '#FFFFFF' }}>
        <motion.div
          key={`${filters.category}-${filters.collection}-${filters.maxPrice}`}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="container-brand px-4"
        >
          <span className="section-badge">{pageBadge}</span>
          <h1 className="section-heading mt-2">{pageTitle}</h1>
          <p className="section-subtitle mt-1.5 max-w-2xl mx-auto">{pageSubtitle}</p>
          <div className="gold-divider" />
        </motion.div>
      </div>

      {/* Dynamic Category / Collection Showcase Banner if active */}
      {(activeCategory || activeCollection) && (
        <div className="container-brand px-4 sm:px-6 pt-6">
          <motion.div
            key={filters.category || filters.collection}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="rounded-2xl overflow-hidden shadow-sm border border-pink-100/80 bg-gradient-to-r from-pink-50/70 via-white to-amber-50/40 p-6 md:p-8 flex flex-col md:flex-row items-center gap-6"
          >
            {(activeCategory?.image || activeCollection?.image) && (
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden shrink-0 shadow-md bg-white border border-pink-100">
                <img
                  src={activeCategory?.image || activeCollection?.image || ''}
                  alt={pageTitle}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="text-center md:text-left flex-1">
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full bg-pink-100 text-pink-700 mb-2">
                {pageBadge}
              </span>
              <h2 className="text-2xl sm:text-3xl font-heading font-bold text-gray-900">{pageTitle}</h2>
              <p className="mt-1.5 text-sm sm:text-base text-gray-600 max-w-2xl leading-relaxed">
                {activeCollection?.description || activeCollection?.subtitle || activeCategory?.description || pageSubtitle}
              </p>
              <div className="mt-3 flex items-center justify-center md:justify-start gap-4 text-xs font-medium text-gray-500">
                <span className="bg-white/80 border border-gray-200 px-3 py-1 rounded-full">
                  {total} {total === 1 ? 'Product' : 'Products'} Available
                </span>
                <button
                  onClick={clearFilters}
                  className="text-pink-600 hover:text-pink-700 font-semibold underline underline-offset-2 cursor-pointer"
                >
                  View All Products
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Main Shop Container: Left Sidebar + Right Product Grid */}
      <div className="container-brand px-4 sm:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* ============================================================ */}
          {/* LEFT SIDEBAR (Sticky on Desktop) */}
          {/* ============================================================ */}
          <aside className="w-64 xl:w-72 shrink-0 hidden lg:block">
            <div className="sticky top-24 bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm">
              <SidebarContent />
            </div>
          </aside>

          {/* ============================================================ */}
          {/* RIGHT PRODUCT CATALOG & GRID */}
          {/* ============================================================ */}
          <main className="flex-1 min-w-0 w-full">
            {/* Top Controls: Search Bar, Sort Dropdown & Mobile Filter Button */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
                <input
                  type="text"
                  placeholder="Search sarees, kurtis, 3pc sets, lehengas..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 bg-white border rounded-full text-sm focus:outline-none focus:border-pink-400 shadow-xs"
                  style={{ borderColor: 'var(--color-pink-light)' }}
                />
                {searchInput && (
                  <button
                    onClick={() => setSearchInput('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Sort By Dropdown */}
              <div className="relative">
                <select
                  value={filters.sortBy}
                  onChange={(e) => updateFilter('sortBy', e.target.value)}
                  className="appearance-none bg-white border rounded-full px-5 py-3 text-sm pr-10 focus:outline-none cursor-pointer shadow-xs font-nav"
                  style={{ borderColor: 'var(--color-pink-light)' }}
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>

              {/* Mobile Filter & Categories Button (Visible only on < lg screens) */}
              <button
                onClick={() => setShowMobileSidebar(true)}
                className="lg:hidden flex items-center justify-center gap-2 font-nav font-bold text-sm px-5 py-3 rounded-full border transition-all shadow-xs bg-white text-gray-800 border-pink-200 hover:border-pink-400 cursor-pointer"
              >
                <SlidersHorizontal size={15} />
                Categories &amp; Filters
                {hasActiveFilters && (
                  <span className="w-5 h-5 rounded-full bg-pink-600 text-white text-xs flex items-center justify-center font-bold">
                    !
                  </span>
                )}
              </button>
            </div>

            {/* Active Filters Bar */}
            {hasActiveFilters && (
              <div className="flex items-center gap-2 flex-wrap mb-6 bg-pink-50/80 border border-pink-100 p-3 rounded-2xl">
                <span className="text-xs font-nav font-bold text-gray-600">Active Filters:</span>
                {activeCategory && (
                  <span className="inline-flex items-center gap-1 text-xs font-nav font-semibold bg-white border border-pink-200 text-pink-700 px-3 py-1 rounded-full shadow-xs">
                    Category: {activeCategory.name}
                    <button onClick={() => updateFilter('category', '')} className="hover:text-pink-900 ml-1 cursor-pointer">
                      <X size={12} />
                    </button>
                  </span>
                )}
                {activeCollection && (
                  <span className="inline-flex items-center gap-1 text-xs font-nav font-semibold bg-white border border-amber-200 text-[#1f0b24] px-3 py-1 rounded-full shadow-xs">
                    Collection: {activeCollection.title}
                    <button onClick={() => updateFilter('collection', '')} className="hover:text-pink-900 ml-1 cursor-pointer">
                      <X size={12} />
                    </button>
                  </span>
                )}
                {filters.maxPrice && (
                  <span className="inline-flex items-center gap-1 text-xs font-nav font-semibold bg-white border border-green-200 text-green-800 px-3 py-1 rounded-full shadow-xs">
                    Price: Under ₹{filters.maxPrice}
                    <button onClick={() => updateFilter('maxPrice', undefined)} className="hover:text-green-950 ml-1 cursor-pointer">
                      <X size={12} />
                    </button>
                  </span>
                )}
                {filters.fabric && (
                  <span className="inline-flex items-center gap-1 text-xs font-nav font-semibold bg-white border border-pink-200 text-gray-700 px-3 py-1 rounded-full shadow-xs">
                    Fabric: {filters.fabric}
                    <button onClick={() => updateFilter('fabric', '')} className="hover:text-pink-900 ml-1 cursor-pointer">
                      <X size={12} />
                    </button>
                  </span>
                )}
                {filters.search && (
                  <span className="inline-flex items-center gap-1 text-xs font-nav font-semibold bg-white border border-pink-200 text-gray-700 px-3 py-1 rounded-full shadow-xs">
                    Search: "{filters.search}"
                    <button onClick={() => setSearchInput('')} className="hover:text-pink-900 ml-1 cursor-pointer">
                      <X size={12} />
                    </button>
                  </span>
                )}
                <button
                  onClick={clearFilters}
                  className="text-xs font-nav font-bold text-pink-600 hover:text-pink-800 ml-auto hover:underline cursor-pointer"
                >
                  Reset All
                </button>
              </div>
            )}

            {/* Products Grid */}
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-4 md:gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <ProductSkeleton key={i} />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-pink-100 p-8 shadow-xs">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="font-heading text-xl text-gray-700 font-bold mb-2">No products found</h3>
                <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto leading-relaxed">
                  No products matched your selected category or filter. Try choosing another category from the left menu or reset your filters.
                </p>
                <button onClick={clearFilters} className="btn-pink px-6 py-2.5 text-sm cursor-pointer">
                  View All Products
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-4 md:gap-6">
                {products.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>
            )}

            {/* Pagination / Load More */}
            {!isLoading && productsData?.hasMore && (
              <div className="mt-12 text-center">
                <button
                  onClick={() => setFilters((f) => ({ ...f, page: (f.page || 1) + 1 }))}
                  className="btn-outline-pink px-8 py-3 cursor-pointer"
                >
                  Load More Products
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ============================================================ */}
      {/* MOBILE CATEGORY & FILTER DRAWER */}
      {/* ============================================================ */}
      <AnimatePresence>
        {showMobileSidebar && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileSidebar(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-xs"
            />

            {/* Slide-out Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="absolute left-0 top-0 bottom-0 w-4/5 max-w-sm bg-white shadow-2xl p-6 overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
                <h3 className="font-heading font-bold text-lg text-gray-900">Filters &amp; Categories</h3>
                <button
                  onClick={() => setShowMobileSidebar(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:text-black cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <SidebarContent />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

