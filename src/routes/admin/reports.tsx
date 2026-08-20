import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { TrendingUp, ShoppingBag, Inbox, ArrowUpRight, DollarSign } from 'lucide-react'
import { formatPrice } from '../../utils/format'

export const Route = createFileRoute('/admin/reports')({
  component: AdminReports,
})

const SALES_BY_CATEGORY = [
  { category: 'Silk Sarees', orders: 48, revenue: 528000, percentage: 55 },
  { category: 'Designer Sarees', orders: 22, revenue: 195800, percentage: 20 },
  { category: 'Lehengas', orders: 12, revenue: 168000, percentage: 17 },
  { category: 'Kurtis', orders: 35, revenue: 70000, percentage: 8 },
]

const MONTHLY_REVENUE = [
  { month: 'Jan', revenue: 85000 },
  { month: 'Feb', revenue: 95000 },
  { month: 'Mar', revenue: 110000 },
  { month: 'Apr', revenue: 125000 },
  { month: 'May', revenue: 140000 },
  { month: 'Jun', revenue: 165000 },
  { month: 'Jul', revenue: 185000 },
]

function AdminReports() {
  const totalSales = MONTHLY_REVENUE.reduce((acc, curr) => acc + curr.revenue, 0)
  const averageSales = totalSales / MONTHLY_REVENUE.length

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-700 text-gray-800">Reports &amp; Analytics</h1>
        <p className="text-gray-500 text-sm mt-0.5">Overview of store sales volume, performance, and category distributions</p>
      </div>

      {/* Stats Summary Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { title: 'Total Sales', value: formatPrice(totalSales), icon: DollarSign, change: '+12.5%', color: 'var(--color-pink)' },
          { title: 'Average Monthly', value: formatPrice(averageSales), icon: TrendingUp, change: '+8.4%', color: 'var(--color-gold)' },
          { title: 'Total Inquiries', value: 245, icon: Inbox, change: '+18.2%', color: '#3b82f6' },
          { title: 'Conversion Rate', value: '4.8%', icon: ShoppingBag, change: '+1.5%', color: '#10b981' },
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
            <div className="flex items-center gap-1 mt-2 text-xs font-600 text-green-500">
              <ArrowUpRight size={14} />
              <span>{card.change} vs last month</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Detailed Analysis Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Sales by Category (Progress Bars) */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border lg:col-span-2" style={{ borderColor: '#f0e0e8' }}>
          <h2 className="font-heading text-lg font-700 text-gray-800 mb-6">Sales by Product Category</h2>
          <div className="space-y-5">
            {SALES_BY_CATEGORY.map((item) => (
              <div key={item.category} className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-600 text-gray-700">{item.category}</span>
                  <span className="font-nav font-700 text-gray-500">{formatPrice(item.revenue)} ({item.orders} orders)</span>
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
                <div className="text-[10px] text-right font-nav font-700 text-gray-400">{item.percentage}% of total revenue</div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Revenue Trends List */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border" style={{ borderColor: '#f0e0e8' }}>
          <h2 className="font-heading text-lg font-700 text-gray-800 mb-4">Monthly Trends</h2>
          <div className="space-y-4">
            {MONTHLY_REVENUE.map((item, i) => (
              <div key={item.month} className="flex items-center justify-between py-2 border-b last:border-0 border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center font-nav font-700 text-sm text-gray-500 bg-gray-50">
                    {i + 1}
                  </div>
                  <span className="font-600 text-gray-700">{item.month} 2026</span>
                </div>
                <span className="font-nav font-700 text-sm" style={{ color: 'var(--color-pink)' }}>
                  {formatPrice(item.revenue)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
