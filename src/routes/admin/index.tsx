import { createFileRoute, Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import {
  Package, Tag, Inbox, TrendingUp, Users, ShoppingBag, DollarSign,
  Plus, ArrowRight
} from 'lucide-react'
import { getProducts } from '../../services/products'
import { getCategories } from '../../services/categories'
import { getEnquiries } from '../../services/enquiries'
import { formatPrice } from '../../utils/format'
import { isSupabaseConfigured } from '../../lib/supabase'

export const Route = createFileRoute('/admin/')({
  component: AdminDashboard,
})

interface Order {
  id: string
  customer_name: string
  email: string
  phone: string
  product_name: string
  quantity: number
  total_price: number
  status: 'Pending' | 'Shipped' | 'Delivered'
  date: string
}

const MOCK_ORDERS: Order[] = [
  { id: 'ORD-001', customer_name: 'Priya Sharma', email: 'priya@gmail.com', phone: '9876543210', product_name: 'Royal Kanjivaram Silk Saree', quantity: 1, total_price: 10999, status: 'Pending', date: '2026-08-08' },
  { id: 'ORD-002', customer_name: 'Ananya Rao', email: 'ananya@gmail.com', phone: '9876543211', product_name: 'Crimson Bridal Silk Saree', quantity: 1, total_price: 24999, status: 'Shipped', date: '2026-08-07' },
  { id: 'ORD-003', customer_name: 'Deepa Patel', email: 'deepa@gmail.com', phone: '9876543212', product_name: 'Handwoven Chanderi Cotton Saree', quantity: 2, total_price: 7998, status: 'Delivered', date: '2026-08-06' },
  { id: 'ORD-004', customer_name: 'Kavitha Reddy', email: 'kavitha@gmail.com', phone: '9876543213', product_name: 'Emerald Green Banarasi Saree', quantity: 1, total_price: 18999, status: 'Pending', date: '2026-08-05' },
]

const MOCK_ENQUIRIES = [
  { id: 'ENQ-001', name: 'Lakshmi Rao', phone: '+91 98765 12345', message: 'Do you have bulk pricing for wedding Kanjivaram orders?', date: '10 mins ago' },
  { id: 'ENQ-002', name: 'Sunita Verma', phone: '+91 91234 56789', message: 'Interested in customization options for Bridal Lehenga Choli.', date: '1 hour ago' },
]

function StatCard({
  icon: Icon,
  title,
  value,
  change,
  gradient,
  index,
  href,
}: {
  icon: React.ElementType
  title: string
  value: string | number
  change?: string
  gradient: string
  index: number
  href: string
}) {
  return (
    <Link to={href as any}>
      <motion.div
        className={`rounded-2xl p-5 text-white shadow-md relative overflow-hidden group hover:shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer ${gradient}`}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.04, duration: 0.3 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center transition-transform group-hover:scale-105">
            <Icon size={22} className="text-white" />
          </div>
          {change && (
            <span className="flex items-center gap-1 text-[11px] font-nav font-700 text-white bg-white/20 backdrop-blur-xs px-2.5 py-0.5 rounded-full border border-white/20">
              <TrendingUp size={12} />
              {change}
            </span>
          )}
        </div>
        <div className="font-sans text-2xl sm:text-3xl font-800 tracking-tight mb-1 text-white">{value}</div>
        <div className="font-nav text-[11px] font-700 text-white/80 uppercase tracking-wider flex items-center justify-between">
          <span>{title}</span>
          <ArrowRight size={13} className="text-white/60 group-hover:text-white transition-colors" />
        </div>
      </motion.div>
    </Link>
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
    enabled: isSupabaseConfigured(),
  })

  const allProducts = productsData?.data || []
  const totalProducts = productsData?.total || allProducts.length
  const totalRevenue = MOCK_ORDERS.reduce((acc, o) => acc + o.total_price, 0) + 915800

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Clean Page Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <h1 className="font-heading text-2xl font-800 text-slate-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-xs text-slate-500 mt-1 font-nav">
            Sri Subhakari Fashions executive control panel &amp; key store metrics
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/admin/products/new"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-nav font-700 text-xs text-white bg-pink-600 hover:bg-pink-500 transition-all shadow-sm active:scale-98"
          >
            <Plus size={15} /> Add New Product
          </Link>
          <Link
            to="/admin/categories"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-nav font-700 text-xs text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/90 transition-all shadow-2xs"
          >
            <Tag size={15} /> Categories
          </Link>
        </div>
      </div>

      {/* KPI Overview Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard
          icon={DollarSign}
          title="Total Sales"
          value={formatPrice(totalRevenue)}
          change="+14.2%"
          gradient="bg-gradient-to-br from-red-500 to-rose-600"
          index={0}
          href="/admin/reports"
        />
        <StatCard
          icon={ShoppingBag}
          title="Recent Orders"
          value={MOCK_ORDERS.length + 42}
          change="+5 today"
          gradient="bg-gradient-to-br from-blue-500 to-sky-600"
          index={1}
          href="/admin/orders"
        />
        <StatCard
          icon={Inbox}
          title="Customer Leads"
          value={enquiries?.length || MOCK_ENQUIRIES.length}
          change="3 new"
          gradient="bg-gradient-to-br from-teal-400 to-emerald-600"
          index={2}
          href="/admin/enquiries"
        />
        <StatCard
          icon={Package}
          title="Total Products"
          value={totalProducts}
          change="+8 new"
          gradient="bg-gradient-to-br from-purple-500 to-indigo-600"
          index={3}
          href="/admin/products"
        />
        <StatCard
          icon={Tag}
          title="Categories"
          value={categories?.length || 8}
          gradient="bg-gradient-to-br from-fuchsia-500 to-pink-600"
          index={4}
          href="/admin/categories"
        />
        <StatCard
          icon={Users}
          title="Customers"
          value="5,240+"
          change="+12.5%"
          gradient="bg-gradient-to-br from-cyan-500 to-blue-600"
          index={5}
          href="/admin/customers"
        />
      </div>

      {/* Clean Recent Activity Summary */}
      <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80">
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="font-heading text-lg font-800 text-slate-900 tracking-tight">Recent Activity Highlights</h2>
            <p className="text-xs text-slate-400 mt-0.5">Quick view of latest customer dispatches and leads</p>
          </div>
          <Link
            to="/admin/orders"
            className="flex items-center gap-1.5 text-xs font-nav font-700 text-cyan-600 hover:text-cyan-700 bg-cyan-50 px-3 py-1.5 rounded-xl border border-cyan-100 transition-all"
          >
            View All Dispatches <ArrowRight size={13} />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-center justify-between">
            <div>
              <p className="text-xs font-nav font-700 text-slate-900">4 New Customer Orders</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Pending dispatch verification &amp; shipping</p>
            </div>
            <Link to="/admin/orders" className="text-xs font-700 text-cyan-600 hover:underline">
              Orders &rarr;
            </Link>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-center justify-between">
            <div>
              <p className="text-xs font-nav font-700 text-slate-900">2 WhatsApp Customer Leads</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Wedding saree bulk pricing inquiries</p>
            </div>
            <Link to="/admin/enquiries" className="text-xs font-700 text-cyan-600 hover:underline">
              Leads &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}





