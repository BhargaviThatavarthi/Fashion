import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Save } from 'lucide-react'
import { CONTACT, SITE_NAME } from '../../constants'

export const Route = createFileRoute('/admin/settings')({
  component: AdminSettings,
})

function AdminSettings() {
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    siteName: SITE_NAME,
    phone: CONTACT.phone,
    email: CONTACT.email,
    address: CONTACT.address,
    businessHours: CONTACT.businessHours,
  })

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const Field = ({ label, name, type = 'text' }: { label: string; name: keyof typeof form; type?: string }) => (
    <div>
      <label className="block font-nav text-xs font-700 uppercase tracking-wide text-gray-500 mb-1.5">
        {label}
      </label>
      <input
        type={type}
        value={form[name]}
        onChange={(e) => setForm((f) => ({ ...f, [name]: e.target.value }))}
        className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none"
        style={{ borderColor: 'var(--color-pink-light)' }}
      />
    </div>
  )

  return (
    <div>
      <h1 className="font-heading text-2xl font-700 text-gray-800 mb-6">Settings</h1>

      <form onSubmit={handleSave} className="max-w-2xl space-y-6">
        {/* Company Info */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border" style={{ borderColor: '#f0e0e8' }}>
          <h2 className="font-heading font-700 text-gray-800 mb-5">Company Information</h2>
          <div className="space-y-4">
            <Field label="Business Name" name="siteName" />
            <Field label="Phone Number" name="phone" type="tel" />
            <Field label="Email Address" name="email" type="email" />
            <div>
              <label className="block font-nav text-xs font-700 uppercase tracking-wide text-gray-500 mb-1.5">
                Address
              </label>
              <textarea
                rows={2}
                value={form.address}
                onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none resize-none"
                style={{ borderColor: 'var(--color-pink-light)' }}
              />
            </div>
            <Field label="Business Hours" name="businessHours" />
          </div>
        </div>

        {/* Supabase Config Note */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
          <p className="font-nav font-700 text-amber-700 text-sm mb-2">⚙️ Environment Configuration</p>
          <p className="text-amber-600 text-xs leading-relaxed">
            Add your Supabase credentials to the <code className="bg-amber-100 px-1 py-0.5 rounded">.env</code> file
            to enable the database. Set <code className="bg-amber-100 px-1 py-0.5 rounded">VITE_SUPABASE_URL</code> and{' '}
            <code className="bg-amber-100 px-1 py-0.5 rounded">VITE_SUPABASE_ANON_KEY</code>.
          </p>
        </div>

        <button
          type="submit"
          className="btn-pink px-8 py-3.5 flex items-center gap-2"
        >
          <Save size={16} />
          {saved ? '✓ Saved!' : 'Save Settings'}
        </button>
      </form>
    </div>
  )
}
