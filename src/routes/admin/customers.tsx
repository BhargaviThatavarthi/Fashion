import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Mail, Phone, Calendar, DollarSign, Award } from 'lucide-react'
import { formatPrice } from '../../utils/format'

export const Route = createFileRoute('/admin/customers')({
  component: AdminCustomers,
})

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  ordersCount: number
  totalSpent: number
  joinDate: string
  status: 'Active' | 'Inactive'
}

const MOCK_CUSTOMERS: Customer[] = [
  { id: 'CUST-001', name: 'Priya Sharma', email: 'priya@gmail.com', phone: '9876543210', ordersCount: 5, totalSpent: 35000, joinDate: '2026-01-15', status: 'Active' },
  { id: 'CUST-002', name: 'Ananya Nair', email: 'ananya@gmail.com', phone: '8765432109', ordersCount: 3, totalSpent: 12500, joinDate: '2026-03-22', status: 'Active' },
  { id: 'CUST-003', name: 'Kavitha Nair', email: 'kavitha@gmail.com', phone: '7654321098', ordersCount: 12, totalSpent: 85200, joinDate: '2025-08-11', status: 'Active' },
  { id: 'CUST-004', name: 'Meera Reddy', email: 'meera@gmail.com', phone: '6543210987', ordersCount: 1, totalSpent: 24500, joinDate: '2026-07-20', status: 'Active' },
  { id: 'CUST-005', name: 'Sreedhar Rao', email: 'sreedhar@gmail.com', phone: '9000112233', ordersCount: 0, totalSpent: 0, joinDate: '2026-07-24', status: 'Inactive' },
]

function AdminCustomers() {
  const [search, setSearch] = useState('')

  const filteredCustomers = MOCK_CUSTOMERS.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  )

  const activeCount = MOCK_CUSTOMERS.filter(c => c.status === 'Active').length
  const vipCount = MOCK_CUSTOMERS.filter(c => c.ordersCount >= 5).length
  const totalValue = MOCK_CUSTOMERS.reduce((acc, c) => acc + c.totalSpent, 0)

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-700 text-gray-800">Customers</h1>
        <p className="text-gray-500 text-sm mt-0.5">Directory of registered store customers and buyers</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { title: 'Total Registered', value: MOCK_CUSTOMERS.length, icon: Calendar, color: 'var(--color-pink)' },
          { title: 'Active Accounts', value: activeCount, icon: Award, color: '#3b82f6' },
          { title: 'VIP Customers', value: vipCount, icon: Award, color: 'var(--color-gold)' },
          { title: 'Total Customer Value', value: formatPrice(totalValue), icon: DollarSign, color: '#10b981' },
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
            <div className="font-heading text-2xl font-700 text-gray-800">{card.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Customers List */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border mb-6" style={{ borderColor: '#f0e0e8' }}>
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search by Name, Email, or Phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-pink-500"
              style={{ borderColor: 'var(--color-pink-light)' }}
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border rounded-xl" style={{ borderColor: '#f0e0e8' }}>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b" style={{ borderColor: '#f0e0e8', background: '#fafafa' }}>
                <th className="px-4 py-3 font-nav text-xs font-700 uppercase tracking-wider text-gray-500">Customer ID</th>
                <th className="px-4 py-3 font-nav text-xs font-700 uppercase tracking-wider text-gray-500">Name</th>
                <th className="px-4 py-3 font-nav text-xs font-700 uppercase tracking-wider text-gray-500">Contact Details</th>
                <th className="px-4 py-3 font-nav text-xs font-700 uppercase tracking-wider text-gray-500">Orders</th>
                <th className="px-4 py-3 font-nav text-xs font-700 uppercase tracking-wider text-gray-500">Total Spent</th>
                <th className="px-4 py-3 font-nav text-xs font-700 uppercase tracking-wider text-gray-500">Join Date</th>
                <th className="px-4 py-3 font-nav text-xs font-700 uppercase tracking-wider text-gray-500 text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-400 text-sm">No customers found.</td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => (
                  <tr key={cust.id} className="border-b last:border-0 hover:bg-gray-50/50" style={{ borderColor: '#f0e0e8' }}>
                    <td className="px-4 py-4 font-nav font-700 text-sm text-gray-800">{cust.id}</td>
                    <td className="px-4 py-4 font-600 text-gray-800">{cust.name}</td>
                    <td className="px-4 py-4 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-gray-600">
                        <Mail size={12} className="text-gray-400" />
                        {cust.email}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-600">
                        <Phone size={12} className="text-gray-400" />
                        {cust.phone}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600 font-600">{cust.ordersCount}</td>
                    <td className="px-4 py-4 font-nav font-700 text-sm" style={{ color: 'var(--color-pink)' }}>
                      {formatPrice(cust.totalSpent)}
                    </td>
                    <td className="px-4 py-4 text-xs text-gray-500">{cust.joinDate}</td>
                    <td className="px-4 py-4 text-right">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-700 uppercase ${
                        cust.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'
                      }`}>
                        {cust.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
