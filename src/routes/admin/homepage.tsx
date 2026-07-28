import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Save } from 'lucide-react'

export const Route = createFileRoute('/admin/homepage')({
  component: AdminHomepage,
})

function AdminHomepage() {
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    title: 'Elegance in Every Thread',
    subtitle: 'Discover beautiful sarees and ethnic wear crafted with elegance and tradition.',
    button_text: 'Shop Collection',
    button_link: '/shop',
  })

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-700 text-gray-800 mb-6">Homepage Management</h1>
      <form onSubmit={handleSave} className="max-w-2xl space-y-5">
        <div className="bg-white rounded-2xl p-6 shadow-sm border" style={{ borderColor: '#f0e0e8' }}>
          <h2 className="font-heading font-700 text-gray-800 mb-5">Hero Banner</h2>
          <div className="space-y-4">
            {[
              { label: 'Hero Title', key: 'title' as const },
              { label: 'Subtitle', key: 'subtitle' as const },
              { label: 'Button Text', key: 'button_text' as const },
              { label: 'Button Link', key: 'button_link' as const },
            ].map(({ label, key }) => (
              <div key={key}>
                <label className="block font-nav text-xs font-700 uppercase tracking-wide text-gray-500 mb-1.5">{label}</label>
                <input type="text" value={form[key]} onChange={(e) => setForm(f => ({ ...f, [key]: e.target.value }))}
                  className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none" style={{ borderColor: 'var(--color-pink-light)' }} />
              </div>
            ))}
          </div>
        </div>
        <button type="submit" className="btn-pink px-8 py-3.5 flex items-center gap-2">
          <Save size={16} />{saved ? '✓ Saved!' : 'Save Changes'}
        </button>
      </form>
    </div>
  )
}
