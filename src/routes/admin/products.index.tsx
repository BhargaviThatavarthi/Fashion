import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import {
  Plus, Edit, Trash2, Eye, Copy, FileSpreadsheet,
  Upload, Search, SlidersHorizontal, CheckCircle, XCircle
} from 'lucide-react'
import { getProducts, deleteProduct, createProduct, updateProduct } from '../../services/products'
import { getCategories } from '../../services/categories'
import { formatPrice, slugify, formatDiscount, getImageUrl } from '../../utils/format'

export const Route = createFileRoute('/admin/products/')({
  component: AdminProducts,
})

function AdminProducts() {
  const page = 1
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<'All' | 'featured' | 'best_seller' | 'new_arrival'>('All')
  const [selectedAvailability, setSelectedAvailability] = useState<'All' | 'in_stock' | 'out_of_stock'>('All')
  const [priceRange, setPriceRange] = useState<'All' | 'under_5000' | '5000_15000' | 'above_15000'>('All')
  
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [isExporting, setIsExporting] = useState(false)

  // Fetch Categories
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  })

  // Build filters object
  const filters: any = {
    page,
    limit: 100, // Fetch more for client-side search/filtering if needed, or paginate
    search: search || undefined,
  }
  if (selectedCategory) filters.category = selectedCategory
  if (selectedStatus === 'featured') filters.featured = true
  if (selectedStatus === 'best_seller') filters.bestSeller = true
  if (selectedStatus === 'new_arrival') filters.newArrival = true

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-products', filters],
    queryFn: () => getProducts(filters),
  })

  const rawProducts = data?.data || []

  // Extra client-side filters (Availability & Price Range)
  const products = rawProducts.filter((product) => {
    // Availability filter
    if (selectedAvailability === 'in_stock' && product.in_stock === false) return false
    if (selectedAvailability === 'out_of_stock' && product.in_stock !== false) return false

    // Price range filter
    const activePrice = product.offer_price || product.price
    if (priceRange === 'under_5000' && activePrice >= 5000) return false
    if (priceRange === '5000_15000' && (activePrice < 5000 || activePrice > 15000)) return false
    if (priceRange === 'above_15000' && activePrice <= 15000) return false

    return true
  })

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Delete "${name}"? This cannot be undone.`)) {
      try {
        await deleteProduct(id)
        setSelectedIds(prev => prev.filter(item => item !== id))
        refetch()
      } catch (err) {
        alert('Failed to delete product.')
      }
    }
  }

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return
    if (window.confirm(`Are you sure you want to delete ${selectedIds.length} selected products?`)) {
      try {
        await Promise.all(selectedIds.map((id) => deleteProduct(id)))
        setSelectedIds([])
        alert('Selected products deleted successfully!')
        refetch()
      } catch (err) {
        alert('Failed to delete some products.')
      }
    }
  }

  const handleDuplicate = async (product: any) => {
    try {
      const { id, created_at, updated_at, category, ...rest } = product
      await createProduct({
        ...rest,
        name: `${product.name} (Copy)`,
        slug: `${product.slug}-copy`,
        sku: product.sku ? `${product.sku}-copy` : `SSF-DUP-${Math.floor(100 + Math.random() * 900)}`,
        created_at: new Date().toISOString(),
      })
      alert(`Duplicated "${product.name}" successfully!`)
      refetch()
    } catch (err) {
      alert('Failed to duplicate product.')
    }
  }

  const toggleAvailability = async (product: any) => {
    try {
      await updateProduct(product.id, {
        in_stock: product.in_stock === false ? true : false,
      })
      refetch()
    } catch (err) {
      alert('Failed to toggle availability.')
    }
  }

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(products.map((p) => p.id))
    } else {
      setSelectedIds([])
    }
  }

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id])
    } else {
      setSelectedIds((prev) => prev.filter((item) => item !== id))
    }
  }

  // Export to Excel-compatible CSV
  const handleExportCSV = () => {
    setIsExporting(true)
    try {
      const headers = ['Name', 'Slug', 'Description', 'Category_ID', 'Fabric', 'Price', 'Offer_Price', 'SKU', 'Wash_Care', 'Featured', 'Best_Seller', 'New_Arrival', 'Stock', 'In_Stock']
      const rows = products.map((p) => [
        p.name || '',
        p.slug || '',
        p.description || '',
        p.category_id || '',
        p.fabric || '',
        p.price || 0,
        p.offer_price || '',
        p.sku || '',
        p.wash_care || '',
        p.featured ? 'TRUE' : 'FALSE',
        p.best_seller ? 'TRUE' : 'FALSE',
        p.new_arrival ? 'TRUE' : 'FALSE',
        p.stock || 0,
        p.in_stock !== false ? 'TRUE' : 'FALSE',
      ])

      const csvContent = [
        headers.join(','),
        ...rows.map((r) => r.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(',')),
      ].join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.setAttribute('download', 'ssf_products.csv')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (err) {
      alert('Failed to export CSV.')
    } finally {
      setIsExporting(false)
    }
  }

  // Import from Excel-compatible CSV
  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (event) => {
      const text = event.target?.result as string
      if (!text) return

      try {
        const lines = text.split('\n')
        if (lines.length < 2) {
          alert('Invalid CSV file.')
          return
        }

        const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, '').toLowerCase())
        const importedProducts = []

        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim()
          if (!line) continue

          // Handle simple CSV splitting preserving quotes
          const matches = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || line.split(',')
          const values = matches.map((v) => v.trim().replace(/^"|"$/g, '').replace(/""/g, '"'))

          const row: any = {}
          headers.forEach((header, index) => {
            row[header] = values[index]
          })

          if (row.name) {
            importedProducts.push({
              name: row.name,
              slug: row.slug || slugify(row.name),
              description: row.description || '',
              category_id: row.category_id || null,
              fabric: row.fabric || '',
              price: parseFloat(row.price) || 0,
              offer_price: row.offer_price ? parseFloat(row.offer_price) : null,
              sku: row.sku || `SSF-IMP-${Math.floor(100 + Math.random() * 900)}`,
              wash_care: row.wash_care || '',
              featured: row.featured === 'TRUE',
              best_seller: row.best_seller === 'TRUE',
              new_arrival: row.new_arrival === 'TRUE',
              stock: parseInt(row.stock) || 0,
              in_stock: row.in_stock !== 'FALSE',
              images: [],
            })
          }
        }

        if (importedProducts.length === 0) {
          alert('No products parsed from CSV.')
          return
        }

        await Promise.all(importedProducts.map((p) => createProduct(p)))
        alert(`Successfully imported ${importedProducts.length} products!`)
        refetch()
      } catch (err) {
        alert('Failed to parse CSV file. Please make sure the structure is correct.')
      }
    }
    reader.readAsText(file)
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="font-heading text-2xl font-700 text-gray-800">Products Directory</h1>
          <p className="text-gray-500 text-sm mt-0.5">{products.length} products displayed</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {/* CSV Import */}
          <label className="btn-pink px-4 py-2.5 text-xs flex items-center gap-1.5 cursor-pointer bg-white text-pink-600 border border-pink-200 shadow-sm" style={{ background: 'white', color: 'var(--color-pink)', borderColor: 'var(--color-pink-light)' }}>
            <Upload size={14} />
            Import CSV
            <input type="file" accept=".csv" onChange={handleImportCSV} className="hidden" />
          </label>

          {/* CSV Export */}
          <button
            onClick={handleExportCSV}
            disabled={isExporting || products.length === 0}
            className="btn-pink px-4 py-2.5 text-xs flex items-center gap-1.5 bg-white text-pink-600 border border-pink-200 shadow-sm"
            style={{ background: 'white', color: 'var(--color-pink)', borderColor: 'var(--color-pink-light)' }}
          >
            <FileSpreadsheet size={14} />
            Export CSV
          </button>

          {/* Add Product */}
          <Link to="/admin/products/new" className="btn-pink px-5 py-2.5 text-xs flex items-center gap-1.5">
            <Plus size={14} />
            Add Product
          </Link>
        </div>
      </div>

      {/* Search and Filters panel */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border mb-6 space-y-4" style={{ borderColor: '#f0e0e8' }}>
        <div className="flex items-center gap-2 text-gray-700 font-nav font-700 text-xs uppercase tracking-wider mb-2">
          <SlidersHorizontal size={14} className="text-pink-500" />
          Filters &amp; Search
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search bar */}
          <div className="relative lg:col-span-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-pink-500"
              style={{ borderColor: 'var(--color-pink-light)' }}
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border rounded-xl px-3 py-2 text-xs focus:outline-none bg-white text-gray-700"
            style={{ borderColor: 'var(--color-pink-light)' }}
          >
            <option value="">All Categories</option>
            {(categories || []).map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as any)}
            className="border rounded-xl px-3 py-2 text-xs focus:outline-none bg-white text-gray-700"
            style={{ borderColor: 'var(--color-pink-light)' }}
          >
            <option value="All">All Statuses</option>
            <option value="featured">⭐ Featured</option>
            <option value="best_seller">🏆 Bestseller</option>
            <option value="new_arrival">🆕 New Arrival</option>
          </select>

          {/* Availability Filter */}
          <select
            value={selectedAvailability}
            onChange={(e) => setSelectedAvailability(e.target.value as any)}
            className="border rounded-xl px-3 py-2 text-xs focus:outline-none bg-white text-gray-700"
            style={{ borderColor: 'var(--color-pink-light)' }}
          >
            <option value="All">All Availabilities</option>
            <option value="in_stock">🟢 In Stock</option>
            <option value="out_of_stock">🔴 Out of Stock</option>
          </select>

          {/* Price Range Filter */}
          <select
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value as any)}
            className="border rounded-xl px-3 py-2 text-xs focus:outline-none bg-white text-gray-700"
            style={{ borderColor: 'var(--color-pink-light)' }}
          >
            <option value="All">All Price Ranges</option>
            <option value="under_5000">Under ₹5,000</option>
            <option value="5000_15000">₹5,000 - ₹15,000</option>
            <option value="above_15000">Above ₹15,000</option>
          </select>
        </div>

        {/* Bulk Action Controls */}
        {selectedIds.length > 0 && (
          <div className="bg-pink-50/50 border border-pink-100 rounded-xl p-3 flex items-center justify-between animate-fade-in">
            <span className="text-xs font-600 text-gray-700">
              <strong className="text-pink-600">{selectedIds.length}</strong> products selected
            </span>
            <button
              onClick={handleBulkDelete}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-nav font-700 transition-colors flex items-center gap-1"
            >
              <Trash2 size={12} />
              Delete Selected
            </button>
          </div>
        )}
      </div>

      {/* Products Table Card */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden" style={{ borderColor: '#f0e0e8' }}>
        {isLoading ? (
          <div className="p-10 text-center text-gray-400">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="p-10 text-center">
            <div className="text-4xl mb-3">📦</div>
            <p className="text-gray-400">No products found matching filters. Make a new one!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-body">
              <thead>
                <tr className="border-b" style={{ borderColor: '#f0e0e8', background: '#fafafa' }}>
                  <th className="px-5 py-3 w-10">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === products.length && products.length > 0}
                      onChange={handleSelectAll}
                      className="rounded accent-pink-500 cursor-pointer w-4 h-4"
                    />
                  </th>
                  <th className="px-5 py-3 font-nav text-xs font-700 uppercase tracking-wide text-gray-500">Product</th>
                  <th className="px-5 py-3 font-nav text-xs font-700 uppercase tracking-wide text-gray-500">Category</th>
                  <th className="px-5 py-3 font-nav text-xs font-700 uppercase tracking-wide text-gray-500">Original Price</th>
                  <th className="px-5 py-3 font-nav text-xs font-700 uppercase tracking-wide text-gray-500">Discounted Price</th>
                  <th className="px-5 py-3 font-nav text-xs font-700 uppercase tracking-wide text-gray-500">Discount</th>
                  <th className="px-5 py-3 font-nav text-xs font-700 uppercase tracking-wide text-gray-500">Stock</th>
                  <th className="px-5 py-3 font-nav text-xs font-700 uppercase tracking-wide text-gray-500">Availability</th>
                  <th className="px-5 py-3 font-nav text-xs font-700 uppercase tracking-wide text-gray-500">Flags</th>
                  <th className="px-5 py-3 font-nav text-xs font-700 uppercase tracking-wide text-gray-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, i) => {
                  const discount = product.offer_price ? formatDiscount(product.price, product.offer_price) : 0
                  const isSelected = selectedIds.includes(product.id)
                  return (
                    <motion.tr
                      key={product.id}
                      className={`border-b hover:bg-gray-50/30 transition-colors ${isSelected ? 'bg-pink-50/10' : ''}`}
                      style={{ borderColor: '#fde8f0' }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.02 }}
                    >
                      <td className="px-5 py-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => handleSelectOne(product.id, e.target.checked)}
                          className="rounded accent-pink-500 cursor-pointer w-4 h-4"
                        />
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-12 rounded-lg overflow-hidden bg-pink-50 shrink-0 border border-pink-100 flex items-center justify-center">
                            {product.images?.[0] ? (
                              <img src={getImageUrl(product.images[0])} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="text-lg">🥻</div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-nav font-700 text-sm text-gray-800 leading-tight truncate max-w-[150px]" title={product.name}>
                              {product.name}
                            </p>
                            <p className="text-[10px] text-gray-400 font-mono mt-0.5">{product.sku || '—'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-xs font-600 text-gray-600">{product.category?.name || '—'}</td>
                      <td className="px-5 py-4 text-xs font-600 text-gray-500">{formatPrice(product.price)}</td>
                      <td className="px-5 py-4 font-nav font-700 text-sm" style={{ color: 'var(--color-pink)' }}>
                        {formatPrice(product.offer_price || product.price)}
                      </td>
                      <td className="px-5 py-4 text-xs font-700 text-green-600">
                        {discount > 0 ? `${discount}% OFF` : '—'}
                      </td>
                      <td className="px-5 py-4 text-xs font-600 text-gray-600">{product.stock !== undefined ? product.stock : '—'}</td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => toggleAvailability(product)}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-700 uppercase cursor-pointer transition-colors ${
                            product.in_stock !== false ? 'bg-green-50 text-green-600 hover:bg-green-100' : 'bg-red-50 text-red-600 hover:bg-red-100'
                          }`}
                        >
                          {product.in_stock !== false ? (
                            <>
                              <CheckCircle size={10} />
                              In Stock
                            </>
                          ) : (
                            <>
                              <XCircle size={10} />
                              Out of Stock
                            </>
                          )}
                        </button>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex gap-1 flex-wrap">
                          {product.featured && (
                            <span className="text-[9px] font-nav font-700 px-1.5 py-0.5 rounded-full" style={{ background: 'var(--color-pink-light)', color: 'var(--color-pink)' }}>
                              Featured
                            </span>
                          )}
                          {product.best_seller && (
                            <span className="text-[9px] font-nav font-700 px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(200,164,93,0.15)', color: 'var(--color-gold)' }}>
                              Bestseller
                            </span>
                          )}
                          {product.new_arrival && (
                            <span className="text-[9px] font-nav font-700 px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-600">
                              New
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            to="/shop/$slug"
                            params={{ slug: product.slug }}
                            className="w-7 h-7 rounded-lg flex items-center justify-center bg-gray-50 text-gray-500 hover:bg-gray-100 transition-colors"
                            title="View Public Details"
                          >
                            <Eye size={12} />
                          </Link>
                          <button
                            onClick={() => handleDuplicate(product)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors"
                            title="Duplicate Product"
                          >
                            <Copy size={12} />
                          </button>
                          <Link
                            to="/admin/products/$id"
                            params={{ id: product.id }}
                            className="w-7 h-7 rounded-lg flex items-center justify-center bg-gray-50 text-gray-500 hover:bg-gray-100 transition-colors"
                            title="Edit"
                          >
                            <Edit size={12} />
                          </Link>
                          <button
                            onClick={() => handleDelete(product.id, product.name)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
