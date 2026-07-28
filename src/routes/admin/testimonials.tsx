import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Plus, Trash2, Star } from 'lucide-react'
import { getTestimonials, createTestimonial, deleteTestimonial } from '../../services/testimonials'

export const Route = createFileRoute('/admin/testimonials')({
  component: AdminTestimonials,
})

function AdminTestimonials() {
  const { data: testimonials, isLoading, refetch } = useQuery({
    queryKey: ['testimonials'],
    queryFn: getTestimonials,
  })
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ customer_name: '', review: '', rating: 5, image: '' })

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await createTestimonial(form)
      setForm({ customer_name: '', review: '', rating: 5, image: '' })
      setShowForm(false)
      refetch()
    } catch { alert('Failed to add') }
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this testimonial?')) {
      try { await deleteTestimonial(id); refetch() }
      catch { alert('Failed') }
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-700 text-gray-800">Testimonials</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-pink px-5 py-2.5 text-sm flex items-center gap-2">
          <Plus size={16} />Add Testimonial
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border mb-6" style={{ borderColor: '#f0e0e8' }}>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-nav text-xs font-700 uppercase tracking-wide text-gray-500 mb-1.5">Customer Name</label>
                <input type="text" required value={form.customer_name} onChange={(e) => setForm(f => ({ ...f, customer_name: e.target.value }))}
                  className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none" style={{ borderColor: 'var(--color-pink-light)' }} />
              </div>
              <div>
                <label className="block font-nav text-xs font-700 uppercase tracking-wide text-gray-500 mb-1.5">Rating (1-5)</label>
                <select value={form.rating} onChange={(e) => setForm(f => ({ ...f, rating: parseInt(e.target.value) }))}
                  className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none" style={{ borderColor: 'var(--color-pink-light)' }}>
                  {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{'★'.repeat(r)} ({r})</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block font-nav text-xs font-700 uppercase tracking-wide text-gray-500 mb-1.5">Review</label>
              <textarea rows={3} required value={form.review} onChange={(e) => setForm(f => ({ ...f, review: e.target.value }))}
                className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none resize-none" style={{ borderColor: 'var(--color-pink-light)' }} />
            </div>
            <button type="submit" disabled={saving} className="btn-pink px-5 py-2.5 text-sm">{saving ? 'Saving...' : 'Save'}</button>
          </form>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {isLoading ? <div className="text-gray-400">Loading...</div> : (testimonials || []).map((t) => (
          <div key={t.id} className="bg-white rounded-2xl p-5 shadow-sm border relative" style={{ borderColor: '#f0e0e8' }}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex gap-1">
                {[1,2,3,4,5].map(s => <Star key={s} size={13} className={s <= t.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200 fill-gray-200'} />)}
              </div>
              <button onClick={() => handleDelete(t.id)} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-50 text-red-400">
                <Trash2 size={13} />
              </button>
            </div>
            <p className="text-gray-600 text-sm italic mb-3 line-clamp-3">"{t.review}"</p>
            <p className="font-nav font-700 text-sm" style={{ color: 'var(--color-pink)' }}>{t.customer_name}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
