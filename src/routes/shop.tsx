import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react'
import ProductCard from '../components/shop/ProductCard'
import { Skeleton } from '../components/ui/skeleton'
import { getProducts } from '../services/products'
import { getCategories } from '../services/categories'
import { FABRIC_OPTIONS, SORT_OPTIONS } from '../constants'
import type { ProductFilters } from '../types'

type ShopSearch = {
  search?: string
  category?: string
  fabric?: string
  sortBy?: string
}

export const Route = createFileRoute('/shop')({
  validateSearch: (search: Record<string, unknown>): ShopSearch => ({
    search: typeof search.search === 'string' ? search.search : undefined,
    category: typeof search.category === 'string' ? search.category : undefined,
    fabric: typeof search.fabric === 'string' ? search.fabric : undefined,
    sortBy: typeof search.sortBy === 'string' ? search.sortBy : undefined,
  }),
  loaderDeps: ({ search: { search, category, fabric, sortBy } }) => ({
    search,
    category,
    fabric,
    sortBy,
  }),
  loader: async ({ context: { queryClient }, deps }) => {
    const filters = {
      search: deps.search || '',
      category: deps.category || '',
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
      ])
    } catch (err: any) {
      console.warn('Shop route loader notice:', err?.message || err)
    }
  },
  head: () => ({
    meta: [
      { title: 'Shop All — Sri Subhakari Fashions' },
      { name: 'description', content: 'Browse our complete collection of sarees, lehengas, kurtis and ethnic wear. Filter by category, fabric, price and more.' },
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
  const routeSearch = Route.useSearch()
  const [filters, setFilters] = useState<ProductFilters>({
    search: routeSearch.search || '',
    category: routeSearch.category || '',
    fabric: routeSearch.fabric || '',
    sortBy: (routeSearch.sortBy as any) || 'latest',
    page: 1,
    limit: 12,
  })
  const [showFilters, setShowFilters] = useState(false)
  const [searchInput, setSearchInput] = useState(routeSearch.search || '')

  const { data: productsData, isLoading } = useQuery({
    queryKey: ['products', filters],
    queryFn: () => getProducts(filters),
    staleTime: 2 * 60 * 1000,
  })

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
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
  }

  const clearFilters = () => {
    setFilters({ search: '', category: '', fabric: '', sortBy: 'latest', page: 1, limit: 12 })
    setSearchInput('')
  }

  const products = productsData?.data || []
  const total = productsData?.total || 0

  return (
    <div style={{ background: 'var(--color-bg)', minHeight: '100vh' }}>
      {/* Page Header */}
      <div
        className="py-14 text-center"
        style={{ background: '#FFFFFF' }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-badge">🛍️ Our Collection</span>
          <h1 className="section-heading mt-2">Shop All Products</h1>
          <p className="section-subtitle mt-2">{total} Products available</p>
          <div className="gold-divider" />
        </motion.div>
      </div>

      <div className="container-brand px-4 sm:px-6 py-8">
        {/* Top Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search sarees, lehengas, kurtis..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border rounded-full text-sm focus:outline-none focus:border-pink-400 shadow-sm"
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

          {/* Sort */}
          <div className="relative">
            <select
              value={filters.sortBy}
              onChange={(e) => updateFilter('sortBy', e.target.value)}
              className="appearance-none bg-white border rounded-full px-5 py-3 text-sm pr-10 focus:outline-none cursor-pointer"
              style={{ borderColor: 'var(--color-pink-light)' }}
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          {/* Filter toggle (mobile) */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 font-nav font-600 text-sm px-5 py-3 rounded-full border transition-all"
            style={{
              borderColor: showFilters ? 'var(--color-pink)' : 'var(--color-pink-light)',
              color: showFilters ? 'var(--color-pink)' : 'var(--color-gray)',
              background: showFilters ? 'var(--color-pink-light)' : 'white',
            }}
          >
            <SlidersHorizontal size={15} />
            Filters
            {(filters.category || filters.fabric || filters.newArrival || filters.bestSeller) && (
              <span
                className="w-5 h-5 rounded-full text-white text-xs flex items-center justify-center"
                style={{ background: 'var(--color-pink)' }}
              >
                !
              </span>
            )}
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <motion.div
            className="mb-6 p-5 bg-white rounded-2xl border shadow-sm"
            style={{ borderColor: 'var(--color-pink-light)' }}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-nav font-700 text-sm" style={{ color: 'var(--color-text)' }}>
                Filters
              </h3>
              <button
                onClick={clearFilters}
                className="text-xs font-nav font-600 hover:underline"
                style={{ color: 'var(--color-pink)' }}
              >
                Clear All
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Category */}
              <div>
                <label className="block font-nav text-xs font-600 text-gray-500 mb-1.5 uppercase tracking-wide">Category</label>
                <select
                  value={filters.category || ''}
                  onChange={(e) => updateFilter('category', e.target.value)}
                  className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none"
                  style={{ borderColor: 'var(--color-pink-light)' }}
                >
                  <option value="">All Categories</option>
                  {(categories || []).map((cat) => (
                    <option key={cat.id} value={cat.slug}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Fabric */}
              <div>
                <label className="block font-nav text-xs font-600 text-gray-500 mb-1.5 uppercase tracking-wide">Fabric</label>
                <select
                  value={filters.fabric || ''}
                  onChange={(e) => updateFilter('fabric', e.target.value)}
                  className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none"
                  style={{ borderColor: 'var(--color-pink-light)' }}
                >
                  <option value="">All Fabrics</option>
                  {FABRIC_OPTIONS.map((fab) => (
                    <option key={fab} value={fab}>{fab}</option>
                  ))}
                </select>
              </div>

              {/* Quick filters */}
              <div className="col-span-2">
                <label className="block font-nav text-xs font-600 text-gray-500 mb-1.5 uppercase tracking-wide">Quick Filters</label>
                <div className="flex gap-2 flex-wrap">
                  {[
                    { key: 'newArrival', label: '🆕 New Arrivals' },
                    { key: 'bestSeller', label: '🏆 Best Sellers' },
                    { key: 'featured', label: '⭐ Featured' },
                  ].map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() => updateFilter(key as any, !filters[key as keyof ProductFilters])}
                      className="text-xs font-nav font-600 px-3 py-1.5 rounded-full border transition-all"
                      style={{
                        borderColor: filters[key as keyof ProductFilters] ? 'var(--color-pink)' : 'var(--color-pink-light)',
                        background: filters[key as keyof ProductFilters] ? 'var(--color-pink)' : 'white',
                        color: filters[key as keyof ProductFilters] ? 'white' : 'var(--color-gray)',
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="font-heading text-xl text-gray-600 mb-2">No products found</h3>
            <p className="text-gray-400 text-sm mb-6">Try adjusting your filters or search term.</p>
            <button onClick={clearFilters} className="btn-pink px-6 py-2.5 text-sm">
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {!isLoading && productsData?.hasMore && (
          <div className="mt-10 text-center">
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
