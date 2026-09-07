import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { Package, Tag, Inbox, DollarSign } from 'lucide-react'
import { formatPrice } from '../../utils/format'
import { getProducts } from '../../services/products'
import { getCategories } from '../../services/categories'
import { getEnquiries } from '../../services/enquiries'
import { isSupabaseConfigured } from '../../lib/supabase'

export const Route = createFileRoute('/admin/reports')({
  component: AdminReports,
})

function AdminReports() {
  const { data: productsData } = useQuery({
    queryKey: ['products', {}],
    queryFn: () => getProducts({ limit: 100 }),
  })

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  })

  const { data: enquiries } = useQuery({
    queryKey: ['enquiries'],
    queryFn: getEnquiries,
    enabled: isSupabaseConfigured(),
  })

  const products = productsData?.data || []
  const totalProducts = productsData?.total ?? products.length
  const totalInquiries = enquiries?.length || 0
  const totalCategories = categories?.length || 0

  // Calculate inventory valuation based on active products
  const totalInventoryValue = products.reduce((acc, p) => {
    const qty = p.stock_quantity || p.stock || 1
    const price = p.offer_price || p.price || 0
    return acc + (price * qty)
  }, 0)

  const avgProductPrice = totalProducts > 0
    ? Math.round(products.reduce((acc, p) => acc + (p.offer_price || p.price || 0), 0) / (products.length || 1))
    : 0

  // Group products count by category
  const categoryDistribution = (categories || []).map((cat) => {
    const count = products.filter(p =>
      p.category_id === cat.id ||
      p.category?.id === cat.id ||
      p.category?.name === cat.name ||
      p.category?.slug === cat.slug
    ).length
    const percentage = totalProducts > 0 ? Math.round((count / totalProducts) * 100) : 0
    return {
      category: cat.name,
      count,
      percentage,
    }
  })

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-700 text-gray-800">Reports &amp; Analytics</h1>
        <p className="text-gray-500 text-sm mt-0.5">Overview of catalog valuation, store inventory, and category distributions</p>
      </div>

      {/* Stats Summary Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { title: 'Inventory Valuation', value: formatPrice(totalInventoryValue), icon: DollarSign, color: 'var(--color-pink)' },
          { title: 'Avg Item Price', value: formatPrice(avgProductPrice), icon: Package, color: 'var(--color-gold)' },
          { title: 'Total Inquiries', value: totalInquiries, icon: Inbox, color: '#3b82f6' },
          { title: 'Active Categories', value: totalCategories, icon: Tag, color: '#10b981' },
        ].map((card, i) => (
          <motion.div
            key={card.title}
            className="bg-white rounded-2xl p-6 shadow-sm border"
            style={{ borderColor: '#f0e0e8' }}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-nav text-xs font-600 text-gray-400 uppercase tracking-wide">{card.title}</span>
              <card.icon size={18} style={{ color: card.color }} />
            </div>
            <div className="font-sans text-2xl font-800 text-gray-800">{card.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Detailed Analysis Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Products by Category (Progress Bars) */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border lg:col-span-2" style={{ borderColor: '#f0e0e8' }}>
          <h2 className="font-heading text-lg font-700 text-gray-800 mb-6">Catalog Distribution by Category</h2>
          {categoryDistribution.length > 0 ? (
            <div className="space-y-5">
              {categoryDistribution.map((item) => (
                <div key={item.category} className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-600 text-gray-700">{item.category}</span>
                    <span className="font-nav font-700 text-gray-500">{item.count} items ({item.percentage}%)</span>
                  </div>
                  <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{
                        width: `${item.percentage}%`,
                        background: `linear-gradient(90deg, var(--color-pink) 0%, var(--color-gold) 100%)`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-sm text-gray-400 font-nav">
              No categories configured yet.
            </div>
          )}
        </div>

        {/* Store Summary */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border" style={{ borderColor: '#f0e0e8' }}>
          <h2 className="font-heading text-lg font-700 text-gray-800 mb-4">Store Overview</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="font-600 text-gray-700 text-sm">Total Live Products</span>
              <span className="font-nav font-700 text-sm text-pink-600">{totalProducts}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="font-600 text-gray-700 text-sm">Store Categories</span>
              <span className="font-nav font-700 text-sm text-slate-700">{totalCategories}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="font-600 text-gray-700 text-sm">Customer Inquiries</span>
              <span className="font-nav font-700 text-sm text-emerald-600">{totalInquiries}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
