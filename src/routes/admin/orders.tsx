import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, ShoppingBag, Truck, CheckCircle, Clock } from 'lucide-react'
import { formatPrice } from '../../utils/format'

export const Route = createFileRoute('/admin/orders')({
  component: AdminOrders,
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
  { id: 'ORD-001', customer_name: 'Priya Sharma', email: 'priya@gmail.com', phone: '9876543210', product_name: 'Royal Kanjivaram Silk Saree', quantity: 1, total_price: 10999, status: 'Pending', date: '2026-07-24' },
  { id: 'ORD-002', customer_name: 'Ananya Nair', email: 'ananya@gmail.com', phone: '8765432109', product_name: 'Mysore Crepe Chiffon Saree', quantity: 2, total_price: 7598, status: 'Shipped', date: '2026-07-23' },
  { id: 'ORD-003', customer_name: 'Kavitha Nair', email: 'kavitha@gmail.com', phone: '7654321098', product_name: 'Anarkali Kurti with Dupatta', quantity: 1, total_price: 2899, status: 'Delivered', date: '2026-07-22' },
  { id: 'ORD-004', customer_name: 'Meera Reddy', email: 'meera@gmail.com', phone: '6543210987', product_name: 'Bridal Red Lehenga Choli', quantity: 1, total_price: 24500, status: 'Delivered', date: '2026-07-20' },
]

function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Shipped' | 'Delivered'>('All')

  const handleStatusChange = (id: string, newStatus: 'Pending' | 'Shipped' | 'Delivered') => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o))
  }

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.customer_name.toLowerCase().includes(search.toLowerCase()) || o.id.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'All' || o.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Metrics
  const totalRevenue = orders.reduce((acc, o) => acc + o.total_price, 0)
  const pendingCount = orders.filter(o => o.status === 'Pending').length
  const shippedCount = orders.filter(o => o.status === 'Shipped').length
  const deliveredCount = orders.filter(o => o.status === 'Delivered').length

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'Pending': return { bg: 'bg-amber-50 text-amber-600', dot: 'bg-amber-500' }
      case 'Shipped': return { bg: 'bg-blue-50 text-blue-600', dot: 'bg-blue-500' }
      case 'Delivered': return { bg: 'bg-green-50 text-green-600', dot: 'bg-green-500' }
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-700 text-gray-800">Orders</h1>
        <p className="text-gray-500 text-sm mt-0.5">Manage customer orders and dispatch statuses</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { title: 'Total Revenue', value: formatPrice(totalRevenue), icon: ShoppingBag, color: 'var(--color-pink)' },
          { title: 'Pending Dispatch', value: pendingCount, icon: Clock, color: '#f59e0b' },
          { title: 'Shipped Orders', value: shippedCount, icon: Truck, color: '#3b82f6' },
          { title: 'Delivered', value: deliveredCount, icon: CheckCircle, color: '#10b981' },
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

      {/* Filters and List */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border mb-6" style={{ borderColor: '#f0e0e8' }}>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search by Order ID or Customer Name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-pink-500"
              style={{ borderColor: 'var(--color-pink-light)' }}
            />
          </div>
          <div className="flex gap-2">
            {(['All', 'Pending', 'Shipped', 'Delivered'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 text-xs font-nav font-700 rounded-xl border transition-all ${
                  statusFilter === status
                    ? 'bg-pink-50 text-pink-600 border-pink-200'
                    : 'bg-white text-gray-600 border-gray-100 hover:bg-gray-50'
                }`}
                style={statusFilter === status ? { color: 'var(--color-pink)', borderColor: 'var(--color-pink-light)' } : {}}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto border rounded-xl" style={{ borderColor: '#f0e0e8' }}>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b" style={{ borderColor: '#f0e0e8', background: '#fafafa' }}>
                <th className="px-4 py-3 font-nav text-xs font-700 uppercase tracking-wider text-gray-500">Order ID</th>
                <th className="px-4 py-3 font-nav text-xs font-700 uppercase tracking-wider text-gray-500">Customer</th>
                <th className="px-4 py-3 font-nav text-xs font-700 uppercase tracking-wider text-gray-500">Product</th>
                <th className="px-4 py-3 font-nav text-xs font-700 uppercase tracking-wider text-gray-500">Total Price</th>
                <th className="px-4 py-3 font-nav text-xs font-700 uppercase tracking-wider text-gray-500">Status</th>
                <th className="px-4 py-3 font-nav text-xs font-700 uppercase tracking-wider text-gray-500">Date</th>
                <th className="px-4 py-3 font-nav text-xs font-700 uppercase tracking-wider text-gray-500 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-400 text-sm">No orders found.</td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const colors = getStatusColor(order.status)
                  return (
                    <tr key={order.id} className="border-b last:border-0 hover:bg-gray-50/50" style={{ borderColor: '#f0e0e8' }}>
                      <td className="px-4 py-4 font-nav font-700 text-sm text-gray-800">{order.id}</td>
                      <td className="px-4 py-4">
                        <div className="text-sm font-600 text-gray-800">{order.customer_name}</div>
                        <div className="text-xs text-gray-400">{order.phone}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm font-500 text-gray-800">{order.product_name}</div>
                        <div className="text-xs text-gray-400">Qty: {order.quantity}</div>
                      </td>
                      <td className="px-4 py-4 font-nav font-700 text-sm" style={{ color: 'var(--color-pink)' }}>
                        {formatPrice(order.total_price)}
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-700 uppercase ${colors.bg}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-xs text-gray-500">{order.date}</td>
                      <td className="px-4 py-4 text-right">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value as any)}
                          className="border rounded-lg text-xs px-2 py-1 focus:outline-none bg-white text-gray-700 cursor-pointer"
                          style={{ borderColor: 'var(--color-pink-light)' }}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
