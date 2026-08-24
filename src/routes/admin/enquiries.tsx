import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Trash2, Edit3, MessageSquare, Phone, Mail,
  CheckCircle2, Clock, XCircle, ArrowUpDown, UserPlus, RefreshCw, X
} from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'
import type { CustomerLead } from '../../types'

export const Route = createFileRoute('/admin/enquiries')({
  component: AdminCustomerLeads,
})

const INITIAL_MOCK_LEADS: CustomerLead[] = [
  {
    id: 'lead-101',
    customer_name: 'Ananya Sharma',
    phone: '+91 98765 43210',
    email: 'ananya.s@gmail.com',
    source: 'WhatsApp Inquiry',
    message: 'Interested in Kanchipuram Pure Silk Saree for wedding function. Please send price catalog.',
    status: 'New',
    created_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'lead-102',
    customer_name: 'Priya Venkatesh',
    phone: '+91 94450 12345',
    email: 'priya.v@yahoo.com',
    source: 'Website Contact',
    message: 'Looking for bridal lehenga customization details for next month event.',
    status: 'Contacted',
    created_at: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'lead-103',
    customer_name: 'Lakshmi Narayanan',
    phone: '+91 98401 88900',
    email: 'lakshmi.n@outlook.com',
    source: 'Showroom Visit',
    message: 'Purchased 3 Designer Silk Sarees during in-store visit. Requested bulk order discount for family.',
    status: 'Converted',
    created_at: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
]

function AdminCustomerLeads() {
  const [leads, setLeads] = useState<CustomerLead[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('All')
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest')

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingLead, setEditingLead] = useState<CustomerLead | null>(null)

  // Form State
  const [form, setForm] = useState<{
    customer_name: string
    phone: string
    email: string
    source: string
    message: string
    status: 'New' | 'Contacted' | 'Converted' | 'Closed'
  }>({
    customer_name: '',
    phone: '',
    email: '',
    source: 'WhatsApp Inquiry',
    message: '',
    status: 'New',
  })

  // Toast feedback
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }

  // Fetch leads from Supabase database (with local storage fallback)
  const fetchLeads = async () => {
    setLoading(true)
    try {
      if (isSupabaseConfigured()) {
        const { data, error } = await supabase
          .from('customer_leads')
          .select('*')
          .order('created_at', { ascending: sortOrder === 'oldest' })

        if (!error && data) {
          setLeads(data as CustomerLead[])
          if (typeof window !== 'undefined') {
            localStorage.setItem('ssf_customer_leads', JSON.stringify(data))
          }
          setLoading(false)
          return
        }
      }
    } catch (err: any) {
      console.warn('Supabase fetch notice:', err.message)
    }

    // Fallback to local storage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ssf_customer_leads')
      if (saved) {
        try {
          setLeads(JSON.parse(saved))
          setLoading(false)
          return
        } catch {
          // ignore
        }
      }
      localStorage.setItem('ssf_customer_leads', JSON.stringify(INITIAL_MOCK_LEADS))
      setLeads(INITIAL_MOCK_LEADS)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchLeads()

    // Real-time subscription to incoming messages
    if (isSupabaseConfigured()) {
      const channel = supabase
        .channel('admin_customer_leads_channel')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'customer_leads' },
          () => {
            fetchLeads()
          }
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    }
  }, [sortOrder])

  const saveLocalLeads = (newLeads: CustomerLead[]) => {
    setLeads(newLeads)
    if (typeof window !== 'undefined') {
      localStorage.setItem('ssf_customer_leads', JSON.stringify(newLeads))
    }
  }

  // 1. Create New Lead
  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.customer_name || !form.message) {
      showToast('Please enter Customer Name and Message', 'error')
      return
    }

    const newLead: CustomerLead = {
      id: isSupabaseConfigured() ? crypto.randomUUID() : `lead-${Date.now()}`,
      customer_name: form.customer_name,
      phone: form.phone || null,
      email: form.email || null,
      source: form.source || 'Website Contact',
      message: form.message,
      status: form.status,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    try {
      if (isSupabaseConfigured()) {
        const { error } = await supabase.from('customer_leads').insert(newLead)
        if (error) throw error
      }

      const updated = [newLead, ...leads]
      saveLocalLeads(updated)

      showToast('Customer Lead created successfully!', 'success')
      setIsAddModalOpen(false)
      setForm({
        customer_name: '',
        phone: '',
        email: '',
        source: 'WhatsApp Inquiry',
        message: '',
        status: 'New',
      })
    } catch (err: any) {
      showToast(`Failed to save lead: ${err.message}`, 'error')
    }
  }

  // 2. Update Lead Status
  const handleUpdateStatus = async (id: string, newStatus: 'New' | 'Contacted' | 'Converted' | 'Closed') => {
    try {
      if (isSupabaseConfigured()) {
        await supabase
          .from('customer_leads')
          .update({ status: newStatus, updated_at: new Date().toISOString() })
          .eq('id', id)
      }

      const updated = leads.map((l) => (l.id === id ? { ...l, status: newStatus, updated_at: new Date().toISOString() } : l))
      saveLocalLeads(updated)
      showToast(`Lead status updated to ${newStatus}`, 'success')
    } catch (err: any) {
      showToast(`Status update failed: ${err.message}`, 'error')
    }
  }

  // 3. Edit Lead Details
  const handleSaveEditLead = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingLead) return

    try {
      if (isSupabaseConfigured()) {
        const { error } = await supabase
          .from('customer_leads')
          .update({
            customer_name: editingLead.customer_name,
            phone: editingLead.phone,
            email: editingLead.email,
            source: editingLead.source,
            message: editingLead.message,
            status: editingLead.status,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingLead.id)

        if (error) throw error
      }

      const updated = leads.map((l) => (l.id === editingLead.id ? editingLead : l))
      saveLocalLeads(updated)
      showToast('Lead updated successfully!', 'success')
      setEditingLead(null)
    } catch (err: any) {
      showToast(`Update failed: ${err.message}`, 'error')
    }
  }

  // 4. Delete Lead
  const handleDeleteLead = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this customer lead?')) return

    try {
      if (isSupabaseConfigured()) {
        await supabase.from('customer_leads').delete().eq('id', id)
      }

      const updated = leads.filter((l) => l.id !== id)
      saveLocalLeads(updated)
      showToast('Lead deleted', 'success')
    } catch (err: any) {
      showToast(`Delete failed: ${err.message}`, 'error')
    }
  }

  // Filter & Search Logic
  const filteredLeads = leads
    .filter((lead) => {
      const matchSearch =
        lead.customer_name.toLowerCase().includes(search.toLowerCase()) ||
        (lead.phone && lead.phone.includes(search)) ||
        (lead.email && lead.email.toLowerCase().includes(search.toLowerCase())) ||
        lead.message.toLowerCase().includes(search.toLowerCase())

      const matchStatus = statusFilter === 'All' || lead.status === statusFilter
      return matchSearch && matchStatus
    })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'New':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'Contacted':
        return 'bg-amber-50 text-amber-700 border-amber-200'
      case 'Converted':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'Closed':
        return 'bg-slate-100 text-slate-600 border-slate-200'
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200'
    }
  }

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 right-4 z-50 p-4 rounded-2xl shadow-xl flex items-center gap-3 border text-xs font-nav font-700 ${
              toast.type === 'success'
                ? 'bg-emerald-900 text-white border-emerald-700'
                : 'bg-rose-900 text-white border-rose-700'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle2 size={18} className="text-emerald-400" /> : <XCircle size={18} className="text-rose-400" />}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-800 text-slate-900 tracking-tight">Customer Leads Management</h1>
          <p className="text-xs text-slate-500 mt-1">Real-time customer inquiries synchronized with Supabase database <code className="bg-slate-200 px-1.5 py-0.5 rounded text-[11px] font-mono text-cyan-800">customer_leads</code></p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchLeads}
            className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-cyan-600 hover:border-cyan-200 transition-colors shadow-2xs cursor-pointer"
            title="Refresh Leads"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-nav font-700 text-white bg-cyan-600 hover:bg-cyan-500 transition-all shadow-md active:scale-98 cursor-pointer"
          >
            <UserPlus size={16} />
            <span>Add New Lead</span>
          </button>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white rounded-2xl p-4 shadow-2xs border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search leads by customer name, phone, email, or message..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 transition-all"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {['All', 'New', 'Contacted', 'Converted', 'Closed'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-nav font-700 transition-all cursor-pointer border ${
                statusFilter === status
                  ? 'bg-cyan-600 text-white border-cyan-600 shadow-2xs'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {status}
              <span className="ml-1.5 text-[10px] opacity-80">
                ({status === 'All' ? leads.length : leads.filter((l) => l.status === status).length})
              </span>
            </button>
          ))}

          <button
            onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-nav font-700 bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 transition-colors ml-2 shrink-0 cursor-pointer"
          >
            <ArrowUpDown size={13} />
            <span className="capitalize">{sortOrder}</span>
          </button>
        </div>
      </div>

      {/* Leads List / Table */}
      <div className="bg-white rounded-3xl shadow-2xs border border-slate-200/80 overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-slate-400">
            <RefreshCw size={28} className="animate-spin text-cyan-600 mx-auto mb-3" />
            <p className="text-xs font-nav font-700 text-slate-600">Loading customer leads from Supabase...</p>
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-600 mx-auto mb-3">
              <MessageSquare size={26} />
            </div>
            <h3 className="font-heading text-base font-800 text-slate-800">No leads found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">No customer leads matching your search filter. Create a new lead to populate the list.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredLeads.map((lead, i) => (
              <motion.div
                key={lead.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.04 }}
                className="p-5 hover:bg-slate-50/70 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-nav font-700 text-sm text-slate-900">{lead.customer_name}</span>
                    <span className={`text-[10px] font-nav font-700 px-2.5 py-0.5 rounded-full border ${getStatusBadge(lead.status)}`}>
                      {lead.status}
                    </span>
                    {lead.source && (
                      <span className="text-[10px] font-nav font-600 text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded-md border border-cyan-100">
                        {lead.source}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-sans">{lead.message}</p>

                  <div className="flex items-center gap-4 text-[11px] text-slate-400 font-nav flex-wrap">
                    {lead.phone && (
                      <a href={`tel:${lead.phone}`} className="flex items-center gap-1 hover:text-cyan-600 transition-colors">
                        <Phone size={13} /> {lead.phone}
                      </a>
                    )}
                    {lead.email && (
                      <a href={`mailto:${lead.email}`} className="flex items-center gap-1 hover:text-cyan-600 transition-colors">
                        <Mail size={13} /> {lead.email}
                      </a>
                    )}
                    {lead.created_at && (
                      <span className="flex items-center gap-1">
                        <Clock size={13} /> {new Date(lead.created_at).toLocaleDateString()} {new Date(lead.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex items-center gap-2 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                  {/* Status Dropdown */}
                  <select
                    value={lead.status}
                    onChange={(e) => handleUpdateStatus(lead.id, e.target.value as any)}
                    className="text-xs font-nav font-700 bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-cyan-500 cursor-pointer"
                  >
                    <option value="New">Status: New</option>
                    <option value="Contacted">Status: Contacted</option>
                    <option value="Converted">Status: Converted</option>
                    <option value="Closed">Status: Closed</option>
                  </select>

                  <button
                    onClick={() => setEditingLead(lead)}
                    className="p-2 rounded-xl text-slate-500 hover:text-cyan-600 hover:bg-cyan-50 border border-slate-200 transition-colors cursor-pointer"
                    title="Edit Lead Details"
                  >
                    <Edit3 size={15} />
                  </button>

                  <button
                    onClick={() => handleDeleteLead(lead.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors cursor-pointer"
                    title="Delete Lead"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* CREATE NEW LEAD MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-6 max-w-lg w-full relative shadow-2xl border border-slate-200"
          >
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
              <h2 className="font-heading text-lg font-800 text-slate-900">Add New Customer Lead</h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block font-nav font-700 text-slate-700 mb-1">Customer Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ananya Sharma"
                  value={form.customer_name}
                  onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-nav font-700 text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+91 98765 43210"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block font-nav font-700 text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="customer@email.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-nav font-700 text-slate-700 mb-1">Lead Source</label>
                  <select
                    value={form.source}
                    onChange={(e) => setForm({ ...form, source: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="WhatsApp Inquiry">WhatsApp Inquiry</option>
                    <option value="Website Contact">Website Contact</option>
                    <option value="Showroom Visit">Showroom Visit</option>
                    <option value="Instagram DM">Instagram DM</option>
                    <option value="Referral">Referral</option>
                  </select>
                </div>

                <div>
                  <label className="block font-nav font-700 text-slate-700 mb-1">Initial Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Converted">Converted</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-nav font-700 text-slate-700 mb-1">Inquiry / Message Notes *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Details about customer saree preferences, budget, or wedding date..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-nav font-700 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-nav font-700 shadow-md transition-all cursor-pointer"
                >
                  Save Lead to Supabase
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* EDIT LEAD MODAL */}
      {editingLead && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-6 max-w-lg w-full relative shadow-2xl border border-slate-200"
          >
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
              <h2 className="font-heading text-lg font-800 text-slate-900">Edit Customer Lead</h2>
              <button
                onClick={() => setEditingLead(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveEditLead} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block font-nav font-700 text-slate-700 mb-1">Customer Name</label>
                <input
                  type="text"
                  required
                  value={editingLead.customer_name}
                  onChange={(e) => setEditingLead({ ...editingLead, customer_name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-nav font-700 text-slate-700 mb-1">Phone</label>
                  <input
                    type="text"
                    value={editingLead.phone || ''}
                    onChange={(e) => setEditingLead({ ...editingLead, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block font-nav font-700 text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={editingLead.email || ''}
                    onChange={(e) => setEditingLead({ ...editingLead, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-nav font-700 text-slate-700 mb-1">Source</label>
                  <input
                    type="text"
                    value={editingLead.source || ''}
                    onChange={(e) => setEditingLead({ ...editingLead, source: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block font-nav font-700 text-slate-700 mb-1">Status</label>
                  <select
                    value={editingLead.status}
                    onChange={(e) => setEditingLead({ ...editingLead, status: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Converted">Converted</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-nav font-700 text-slate-700 mb-1">Message Notes</label>
                <textarea
                  rows={3}
                  required
                  value={editingLead.message}
                  onChange={(e) => setEditingLead({ ...editingLead, message: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingLead(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-nav font-700 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-nav font-700 shadow-md transition-all cursor-pointer"
                >
                  Update Lead
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
