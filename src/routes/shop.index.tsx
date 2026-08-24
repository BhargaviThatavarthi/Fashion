import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { Search, SlidersHorizontal, X, ChevronDown, Tag, Layers } from 'lucide-react'
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
}

export const Route = createFileRoute('/shop/')({
  validateSearch: (search: Record<string, unknown>): ShopSearch => ({
    search: typeof search.search === 'string' ? search.search : undefined,
    category: typeof search.category === 'string' ? search.category : undefined,
    collection: typeof search.collection === 'string' ? search.collection : undefined,
    fabric: typeof search.fabric === 'string' ? search.fabric : undefined,
    sortBy: typeof search.sortBy === 'string' ? search.sortBy : undefined,
  }),
  loaderDeps: ({ search: { search, category, collection, fabric, sortBy } }) => ({
    search,
    category,
    collection,
    fabric,
    sortBy,
  }),
  loader: async ({ context: { queryClient }, deps }) => {
    const filters = {
      search: deps.search || '',
      category: deps.category || '',
      collection: deps.collection || '',
      fabric: deps.fabric || '',
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
          'Browse our complete collection of sarees, silk sarees, tops, lehengas, and ethnic wear. Filter by category, collection, fabric, price and more.',
      },
    ],
  }),
  component: ShopPage,
})

function ProductSkeleton() {
  return (
    <div className="premium-card">
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

function ShopPage() {
  const navigate = useNavigate()
  const routeSearch = Route.useSearch()
  const [filters, setFilters] = useState<ProductFilters>({
    search: routeSearch.search || '',
    category: routeSearch.category || '',
    collection: routeSearch.collection || '',
    fabric: routeSearch.fabric || '',
    sortBy: (routeSearch.sortBy as any) || 'latest',
    page: 1,
    limit: 12,
  })
  const [showFilters, setShowFilters] = useState(false)
  const [searchInput, setSearchInput] = useState(routeSearch.search || '')

  // Keep state synchronized with URL search params
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      search: routeSearch.search || '',
      category: routeSearch.category || '',
      collection: routeSearch.collection || '',
      fabric: routeSearch.fabric || '',
      sortBy: (routeSearch.sortBy as any) || prev.sortBy,
      page: 1,
    }))
    if (routeSearch.search !== undefined) {
      setSearchInput(routeSearch.search || '')
    }
  }, [routeSearch.search, routeSearch.category, routeSearch.collection, routeSearch.fabric, routeSearch.sortBy])

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
        if (!value) delete next[key]
        return next
      },
      replace: true,
    })
  }

  const selectCategory = (slug: string) => {
    const nextCategory = filters.category === slug ? '' : slug
    updateFilter('category', nextCategory)
  }

  const selectCollection = (slug: string) => {
    const nextCollection = filters.collection === slug ? '' : slug
    updateFilter('collection', nextCollection)
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      collection: '',
      fabric: '',
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
  }

  const hasActiveFilters = Boolean(
    filters.category ||
    filters.collection ||
    filters.fabric ||
    filters.newArrival ||
    filters.bestSeller ||
    filters.featured ||
    filters.search
  )

  return (
    <div style={{ background: 'var(--color-bg)', minHeight: '100vh' }}>
      {/* Page Header */}
      <div className="py-12 md:py-16 text-center" style={{ background: '#FFFFFF' }}>
        <motion.div
          key={`${filters.category}-${filters.collection}`}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="container-brand px-4"
        >
          <span className="section-badge">{pageBadge}</span>
          <h1 className="section-heading mt-2">{pageTitle}</h1>
          <p className="section-subtitle mt-2 max-w-2xl mx-auto">{pageSubtitle}</p>
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
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl overflow-hidden shrink-0 shadow-md bg-white border border-pink-100">
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
              <p className="mt-2 text-sm sm:text-base text-gray-600 max-w-2xl leading-relaxed">
                {activeCollection?.description || activeCollection?.subtitle || activeCategory?.description || pageSubtitle}
              </p>
              <div className="mt-3 flex items-center justify-center md:justify-start gap-4 text-xs font-medium text-gray-500">
                <span className="bg-white/80 border border-gray-200 px-3 py-1 rounded-full">
                  {total} {total === 1 ? 'Product' : 'Products'} Available
                </span>
                <button
                  onClick={() => {
                    if (filters.category) updateFilter('category', '')
                    if (filters.collection) updateFilter('collection', '')
                  }}
                  className="text-pink-600 hover:text-pink-700 font-semibold underline underline-offset-2 cursor-pointer"
                >
                  View All Products
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <div className="container-brand px-4 sm:px-6 py-6">
        {/* Dynamic Category Navigation Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-nav font-bold text-gray-500 uppercase tracking-wider">
              Categories
            </h2>
            {filters.category && (
              <button
                onClick={() => updateFilter('category', '')}
                className="text-xs font-nav text-pink-600 hover:text-pink-700 font-semibold flex items-center gap-1 cursor-pointer"
              >
                Show All Categories <X size={12} />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => updateFilter('category', '')}
              className={`text-xs sm:text-sm font-nav font-bold px-4 py-2 rounded-full whitespace-nowrap transition-all border cursor-pointer ${
                !filters.category
                  ? 'bg-[#d85c8a] text-white border-[#d85c8a] shadow-md shadow-pink-500/20'
                  : 'bg-white text-gray-700 border-pink-100 hover:border-pink-300'
              }`}
            >
              All Categories
            </button>
            {STATIC_CATEGORIES.map((cat) => {
              const isSelected =
                filters.category === cat.slug ||
                filters.category === cat.id ||
                filters.category === cat.name ||
                cat.aliases.includes(filters.category || '')
              return (
                <button
                  key={cat.id}
                  onClick={() => selectCategory(cat.slug)}
                  className={`text-xs sm:text-sm font-nav font-bold px-4 py-2 rounded-full whitespace-nowrap transition-all flex items-center gap-2 border cursor-pointer ${
                    isSelected
                      ? 'bg-[#d85c8a] text-white border-[#d85c8a] shadow-md shadow-pink-500/20 scale-105'
                      : 'bg-white text-gray-700 border-pink-100 hover:border-pink-300 hover:bg-pink-50/50'
                  }`}
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-5 h-5 rounded-full object-cover border border-white/40 shadow-xs"
                  />
                  <span>{cat.name}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Dynamic Collections Bar */}
        {collections.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-nav font-bold text-gray-500 uppercase tracking-wider">
                Collections &amp; Sections
              </h2>
              {filters.collection && (
                <button
                  onClick={() => updateFilter('collection', '')}
                  className="text-xs font-nav text-pink-600 hover:text-pink-700 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  Clear Collection <X size={12} />
                </button>
              )}
            </div>
            <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
              {collections.map((col) => {
                const isSelected = filters.collection === col.slug || filters.collection === col.id
                return (
                  <button
                    key={col.id}
                    onClick={() => selectCollection(col.slug)}
                    className={`text-xs sm:text-sm font-nav font-bold px-4 py-2 rounded-full whitespace-nowrap transition-all border flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-[#1f0b24] text-amber-300 border-[#1f0b24] shadow-md shadow-black/20 scale-105'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-pink-300 hover:bg-pink-50/30'
                    }`}
                  >
                    <span>{col.title}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Active Filter Pills Bar */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 flex-wrap mb-6 bg-pink-50/80 border border-pink-100 p-3 rounded-2xl">
            <span className="text-xs font-nav font-bold text-gray-600">Active Filters:</span>
            {activeCategory && (
              <span className="inline-flex items-center gap-1 text-xs font-nav font-semibold bg-white border border-pink-200 text-pink-700 px-3 py-1 rounded-full shadow-xs">
                Category: {activeCategory.name}
                <button onClick={() => updateFilter('category', '')} className="hover:text-pink-900 ml-1">
                  <X size={12} />
                </button>
              </span>
            )}
            {activeCollection && (
              <span className="inline-flex items-center gap-1 text-xs font-nav font-semibold bg-white border border-amber-200 text-[#1f0b24] px-3 py-1 rounded-full shadow-xs">
                Collection: {activeCollection.title}
                <button onClick={() => updateFilter('collection', '')} className="hover:text-pink-900 ml-1">
                  <X size={12} />
                </button>
              </span>
            )}
            {filters.fabric && (
              <span className="inline-flex items-center gap-1 text-xs font-nav font-semibold bg-white border border-pink-200 text-gray-700 px-3 py-1 rounded-full shadow-xs">
                Fabric: {filters.fabric}
                <button onClick={() => updateFilter('fabric', '')} className="hover:text-pink-900 ml-1">
                  <X size={12} />
                </button>
              </span>
            )}
            {filters.search && (
              <span className="inline-flex items-center gap-1 text-xs font-nav font-semibold bg-white border border-pink-200 text-gray-700 px-3 py-1 rounded-full shadow-xs">
                Search: "{filters.search}"
                <button onClick={() => setSearchInput('')} className="hover:text-pink-900 ml-1">
                  <X size={12} />
                </button>
              </span>
            )}
            <button
              onClick={clearFilters}
              className="text-xs font-nav font-bold text-pink-600 hover:text-pink-800 ml-auto hover:underline"
            >
              Reset All
            </button>
          </div>
        )}

        {/* Top Controls: Search, Sort, Filter Toggle */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search sarees, tops, lehengas, fabrics..."
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

          {/* More Filters Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 font-nav font-bold text-sm px-5 py-3 rounded-full border transition-all shadow-xs"
            style={{
              borderColor: showFilters ? 'var(--color-pink)' : 'var(--color-pink-light)',
              color: showFilters ? 'var(--color-pink)' : 'var(--color-gray)',
              background: showFilters ? 'var(--color-pink-light)' : 'white',
            }}
          >
            <SlidersHorizontal size={15} />
            More Filters
            {filters.fabric && (
              <span
                className="w-5 h-5 rounded-full text-white text-xs flex items-center justify-center font-bold"
                style={{ background: 'var(--color-pink)' }}
              >
                1
              </span>
            )}
          </button>
        </div>

        {/* Filter Drawer / Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              className="mb-6 p-5 bg-white rounded-2xl border shadow-sm"
              style={{ borderColor: 'var(--color-pink-light)' }}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-nav font-bold text-sm" style={{ color: 'var(--color-text)' }}>
                  Filter Products
                </h3>
                <button
                  onClick={clearFilters}
                  className="text-xs font-nav font-bold hover:underline"
                  style={{ color: 'var(--color-pink)' }}
                >
                  Clear All Filters
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {/* Category Selector */}
                <div>
                  <label className="block font-nav text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
                    Category
                  </label>
                  <select
                    value={filters.category || ''}
                    onChange={(e) => updateFilter('category', e.target.value)}
                    className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none"
                    style={{ borderColor: 'var(--color-pink-light)' }}
                  >
                    <option value="">All Categories</option>
                    {STATIC_CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.slug}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Collection Selector */}
                <div>
                  <label className="block font-nav text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
                    Collection / Section
                  </label>
                  <select
                    value={filters.collection || ''}
                    onChange={(e) => updateFilter('collection', e.target.value)}
                    className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none"
                    style={{ borderColor: 'var(--color-pink-light)' }}
                  >
                    <option value="">All Collections</option>
                    {collections.map((col) => (
                      <option key={col.id} value={col.slug}>
                        {col.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Fabric Selector */}
                <div>
                  <label className="block font-nav text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
                    Fabric
                  </label>
                  <select
                    value={filters.fabric || ''}
                    onChange={(e) => updateFilter('fabric', e.target.value)}
                    className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none"
                    style={{ borderColor: 'var(--color-pink-light)' }}
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
            </motion.div>
          )}
        </AnimatePresence>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-pink-100 p-8 shadow-xs">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="font-heading text-xl text-gray-700 font-bold mb-2">No products found</h3>
            <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
              No products found in{' '}
              {activeCollection
                ? activeCollection.title
                : activeCategory
                  ? activeCategory.name
                  : 'this filter'}
              . Try selecting another category or resetting filters.
            </p>
            <button onClick={clearFilters} className="btn-pink px-6 py-2.5 text-sm">
              View All Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
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
              className="btn-outline-pink px-8 py-3"
            >
              Load More Products
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
