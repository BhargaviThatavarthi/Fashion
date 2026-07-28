import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Plus, Trash2 } from 'lucide-react'
import { getCategories, createCategory, deleteCategory } from '../../services/categories'
import { slugify } from '../../utils/format'

export const Route = createFileRoute('/admin/categories')({
  component: AdminCategories,
})

function AdminCategories() {
  const { data: categories, isLoading, refetch } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  })
  const [form, setForm] = useState({ name: '', slug: '' })
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await createCategory(form)
      setForm({ name: '', slug: '' })
      setShowForm(false)
      refetch()
    } catch { alert('Failed to add category') }
    setSaving(false)
  }

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Delete category "${name}"?`)) {
      try { await deleteCategory(id); refetch() }
      catch { alert('Failed to delete') }
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-700 text-gray-800">Categories</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-pink px-5 py-2.5 text-sm flex items-center gap-2">
          <Plus size={16} />Add Category
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border mb-6" style={{ borderColor: '#f0e0e8' }}>
          <form onSubmit={handleAdd} className="flex gap-3 items-end">
            <div className="flex-1">
              <label className="block font-nav text-xs font-700 uppercase tracking-wide text-gray-500 mb-1.5">Category Name</label>
              <input type="text" required value={form.name}
                onChange={(e) => setForm({ name: e.target.value, slug: slugify(e.target.value) })}
                placeholder="e.g. Silk Sarees"
                className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none" style={{ borderColor: 'var(--color-pink-light)' }}
              />
            </div>
            <div className="flex-1">
              <label className="block font-nav text-xs font-700 uppercase tracking-wide text-gray-500 mb-1.5">Slug</label>
              <input type="text" required value={form.slug}
                onChange={(e) => setForm(f => ({ ...f, slug: e.target.value }))}
                className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none bg-gray-50" style={{ borderColor: 'var(--color-pink-light)' }}
              />
            </div>
            <button type="submit" disabled={saving} className="btn-pink px-5 py-3 text-sm">{saving ? 'Saving...' : 'Save'}</button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden" style={{ borderColor: '#f0e0e8' }}>
        {isLoading ? <div className="p-10 text-center text-gray-400">Loading...</div> : (
          <div className="divide-y" style={{ borderColor: '#fde8f0' }}>
            {(categories || []).map((cat) => (
              <div key={cat.id} className="flex items-center justify-between p-5 hover:bg-gray-50/50">
                <div>
                  <p className="font-nav font-700 text-sm text-gray-800">{cat.name}</p>
                  <p className="text-xs text-gray-400 font-mono">{cat.slug}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleDelete(cat.id, cat.name)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
