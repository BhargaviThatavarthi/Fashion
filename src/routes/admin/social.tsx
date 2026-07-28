import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Save } from 'lucide-react'
import { SOCIAL } from '../../constants'
import { FaWhatsapp, FaInstagram, FaFacebook, FaYoutube, FaLinkedin } from 'react-icons/fa'

export const Route = createFileRoute('/admin/social')({
  component: AdminSocial,
})

function AdminSocial() {
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({ ...SOCIAL })

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const FIELDS = [
    { label: 'WhatsApp Number', key: 'whatsapp' as const, icon: FaWhatsapp, color: '#25D366' },
    { label: 'Instagram URL', key: 'instagram' as const, icon: FaInstagram, color: '#E1306C' },
    { label: 'Facebook URL', key: 'facebook' as const, icon: FaFacebook, color: '#1877F2' },
    { label: 'YouTube URL', key: 'youtube' as const, icon: FaYoutube, color: '#FF0000' },
    { label: 'LinkedIn URL', key: 'linkedin' as const, icon: FaLinkedin, color: '#0A66C2' },
  ]

  return (
    <div>
      <h1 className="font-heading text-2xl font-700 text-gray-800 mb-6">Social Media Links</h1>
      <form onSubmit={handleSave} className="max-w-2xl space-y-5">
        <div className="bg-white rounded-2xl p-6 shadow-sm border" style={{ borderColor: '#f0e0e8' }}>
          <div className="space-y-4">
            {FIELDS.map(({ label, key, icon: Icon, color }) => (
              <div key={key}>
                <label className="flex items-center gap-2 font-nav text-xs font-700 uppercase tracking-wide text-gray-500 mb-1.5">
                  <Icon size={14} style={{ color }} />{label}
                </label>
                <input type="text" value={form[key]} onChange={(e) => setForm(f => ({ ...f, [key]: e.target.value }))}
                  className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none" style={{ borderColor: 'var(--color-pink-light)' }} />
              </div>
            ))}
          </div>
        </div>
        <button type="submit" className="btn-pink px-8 py-3.5 flex items-center gap-2">
          <Save size={16} />{saved ? '✓ Saved!' : 'Save Links'}
        </button>
      </form>
    </div>
  )
}
