import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { Package, Tag, Inbox, Eye, TrendingUp, Users } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { getProducts } from '../../services/products'
import { getCategories } from '../../services/categories'
import { getEnquiries } from '../../services/enquiries'
import { formatPrice } from '../../utils/format'

export const Route = createFileRoute('/admin/')({
  component: AdminDashboard,
})

function StatCard({
  icon: Icon,
  title,
  value,
  color,
  index,
}: {
  icon: React.ElementType
  title: string
  value: string | number
  color: string
  index: number
}) {
  return (
    <motion.div
      className="bg-white rounded-2xl p-6 shadow-sm border"
      style={{ borderColor: '#f0e0e8' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ background: `${color}15` }}
        >
          <Icon size={22} style={{ color }} />
        </div>
        <TrendingUp size={16} className="text-green-400" />
      </div>
      <div className="font-heading text-3xl font-700 text-gray-800 mb-1">{value}</div>
      <div className="font-nav text-xs font-600 text-gray-400 uppercase tracking-wide">{title}</div>
    </motion.div>
  )
}

function AdminDashboard() {
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
    enabled: !!import.meta.env.VITE_SUPABASE_URL,
  })

  const recentProducts = productsData?.data?.slice(0, 5) || []

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-700 text-gray-800">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back to Sri Subhakari Fashions Admin</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={Package}
          title="Total Products"
          value={productsData?.total || 0}
          color="var(--color-pink)"
          index={0}
        />
        <StatCard
          icon={Tag}
          title="Categories"
          value={categories?.length || 0}
          color="var(--color-gold)"
          index={1}
        />
        <StatCard
          icon={Inbox}
          title="Enquiries"
          value={enquiries?.length || '—'}
          color="#25D366"
          index={2}
        />
        <StatCard
          icon={Users}
          title="Customers"
          value="5,000+"
          color="#3B82F6"
          index={3}
        />
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border" style={{ borderColor: '#f0e0e8' }}>
          <h2 className="font-heading text-lg font-700 text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Add Product', href: '/admin/products', icon: Package, color: 'var(--color-pink)' },
              { label: 'Add Category', href: '/admin/categories', icon: Tag, color: 'var(--color-gold)' },
              { label: 'View Enquiries', href: '/admin/enquiries', icon: Inbox, color: '#25D366' },
              { label: 'Edit Homepage', href: '/admin/homepage', icon: Eye, color: '#3B82F6' },
            ].map(({ label, href, icon: Icon, color }) => (
              <Link
                key={label}
                to={href as any}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100 group"
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}15` }}>
                  <Icon size={16} style={{ color }} />
                </div>
                <span className="font-nav text-xs font-600 text-gray-600 group-hover:text-gray-800">{label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Latest Products */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border" style={{ borderColor: '#f0e0e8' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-lg font-700 text-gray-800">Latest Products</h2>
            <Link to="/admin/products" className="text-xs font-nav font-600 hover:underline" style={{ color: 'var(--color-pink)' }}>
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {recentProducts.map((product) => (
              <div key={product.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-lg shrink-0"
                  style={{ background: 'var(--color-pink-light)' }}
                >
                  🥻
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-nav font-600 text-sm text-gray-800 truncate">{product.name}</p>
                  <p className="text-xs text-gray-400">{formatPrice(product.offer_price || product.price)}</p>
                </div>
                <div className="flex gap-1">
                  {product.featured && (
                    <span className="text-[10px] font-nav font-700 px-1.5 py-0.5 rounded-full" style={{ background: 'var(--color-pink-light)', color: 'var(--color-pink)' }}>
                      ★
                    </span>
                  )}
                  {product.new_arrival && (
                    <span className="text-[10px] font-nav font-700 px-1.5 py-0.5 rounded-full bg-green-100 text-green-600">
                      NEW
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
