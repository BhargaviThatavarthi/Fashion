import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react'
import { FaWhatsapp, FaInstagram, FaFacebook, FaYoutube, FaLinkedin } from 'react-icons/fa'
import { CONTACT, SOCIAL } from '../constants'
import { submitEnquiry } from '../services/enquiries'
import { z } from 'zod'

const contactSearchSchema = z.object({
  product: z.string().catch('').optional(),
})

export const Route = createFileRoute('/contact')({
  validateSearch: (search) => contactSearchSchema.parse(search),
  head: () => ({
    meta: [
      { title: 'Contact Us — Sri Subhakari Fashions' },
      {
        name: 'description',
        content: `Contact Sri Subhakari Fashions. Reach us on WhatsApp, phone, or email. Visit us at ${CONTACT.address}.`,
      },
    ],
  }),
  component: ContactPage,
})

function ContactPage() {
  const { product } = Route.useSearch()
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (product) {
      setForm((f) => ({
        ...f,
        message: `Hi, I am interested in inquiring about the product: "${product}". Please let me know its availability and pricing details.`,
      }))
    }
  }, [product])

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.message.trim()) e.message = 'Message is required'
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email address'
    return e
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setErrors({})
    setStatus('loading')
    try {
      await submitEnquiry(form)
      setStatus('success')
      setForm({ name: '', phone: '', email: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  const field = (key: keyof typeof form) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((f) => ({ ...f, [key]: e.target.value }))
      if (errors[key]) setErrors((err) => ({ ...err, [key]: '' }))
    },
  })

  return (
    <div style={{ background: 'var(--color-bg)' }}>
      {/* Hero */}
      <section
        className="py-20 md:py-24 text-center px-4"
        style={{ background: '#FFFFFF' }}
      >
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <span className="section-badge">📬 Get In Touch</span>
          <h1 className="section-heading mt-2">Contact Us</h1>
          <div className="gold-divider" />
          <p className="section-subtitle max-w-lg mx-auto mt-4">
            We'd love to hear from you! Reach us through WhatsApp, phone, email, or by filling out the form below.
          </p>
        </motion.div>
      </section>

      <section className="py-14 px-4 sm:px-6">
        <div className="container-brand">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              className="premium-card p-8 md:p-10"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-heading text-2xl font-700 text-gray-800 mb-6">
                Send Us a Message
              </h2>

              {status === 'success' ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center py-8"
                >
                  <CheckCircle size={56} className="mx-auto mb-4" style={{ color: 'var(--color-whatsapp)' }} />
                  <h3 className="font-heading text-xl font-700 text-gray-800 mb-2">Message Sent!</h3>
                  <p className="text-gray-500 text-sm">
                    Thank you for reaching out. We'll get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => setStatus('idle')}
                    className="mt-6 btn-outline-pink px-6 py-2.5 text-sm"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  {/* Name */}
                  <div>
                    <label className="block font-nav text-xs font-700 uppercase tracking-wide text-gray-500 mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors"
                      style={{
                        borderColor: errors.name ? '#ef4444' : 'var(--color-pink-light)',
                        background: 'white',
                      }}
                      {...field('name')}
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block font-nav text-xs font-700 uppercase tracking-wide text-gray-500 mb-1.5">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 XXXXXXXXXX"
                      className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none"
                      style={{ borderColor: 'var(--color-pink-light)' }}
                      {...field('phone')}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block font-nav text-xs font-700 uppercase tracking-wide text-gray-500 mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="your@email.com"
                      className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none"
                      style={{
                        borderColor: errors.email ? '#ef4444' : 'var(--color-pink-light)',
                        background: 'white',
                      }}
                      {...field('email')}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block font-nav text-xs font-700 uppercase tracking-wide text-gray-500 mb-1.5">
                      Message *
                    </label>
                    <textarea
                      rows={5}
                      placeholder="Tell us how we can help you..."
                      className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none resize-none"
                      style={{
                        borderColor: errors.message ? '#ef4444' : 'var(--color-pink-light)',
                        background: 'white',
                      }}
                      value={form.message}
                      onChange={(e) => {
                        setForm((f) => ({ ...f, message: e.target.value }))
                        if (errors.message) setErrors((err) => ({ ...err, message: '' }))
                      }}
                    />
                    {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                  </div>

                  {status === 'error' && (
                    <p className="text-red-500 text-sm">Something went wrong. Please try again.</p>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="btn-pink w-full flex items-center justify-center gap-2 py-3.5 disabled:opacity-60"
                  >
                    <Send size={16} />
                    {status === 'loading' ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-heading text-2xl font-700 text-gray-800 mb-6">
                Our Information
              </h2>

              {/* Contact Cards */}
              <div className="space-y-4 mb-8">
                {[
                  { icon: MapPin, title: 'Address', value: CONTACT.address, link: CONTACT.googleMapUrl, color: 'var(--color-pink)' },
                  { icon: Phone, title: 'Phone', value: CONTACT.phone, link: `tel:${CONTACT.phone}`, color: 'var(--color-gold)' },
                  { icon: Mail, title: 'Email', value: CONTACT.email, link: `mailto:${CONTACT.email}`, color: 'var(--color-pink)' },
                  { icon: Clock, title: 'Business Hours', value: CONTACT.businessHours, link: null, color: 'var(--color-gold)' },
                ].map(({ icon: Icon, title, value, link, color }) => (
                  <div key={title} className="flex gap-4 p-4 bg-white rounded-2xl border shadow-sm" style={{ borderColor: 'var(--color-pink-light)' }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${color}15` }}>
                      <Icon size={18} style={{ color }} />
                    </div>
                    <div>
                      <p className="font-nav text-xs font-700 uppercase tracking-wide text-gray-400 mb-0.5">{title}</p>
                      {link ? (
                        <a href={link} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-700 hover:text-pink-600 transition-colors">
                          {value}
                        </a>
                      ) : (
                        <p className="text-sm text-gray-700">{value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* WhatsApp CTA */}
              <a
                href={`https://wa.me/${CONTACT.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp flex items-center justify-center gap-3 w-full py-4 mb-8 text-base"
              >
                <FaWhatsapp size={22} />
                Chat on WhatsApp — Quick Response!
              </a>

              {/* Social Links */}
              <div>
                <h3 className="font-nav font-700 text-xs uppercase tracking-widest text-gray-400 mb-4">
                  Follow Us
                </h3>
                <div className="flex gap-3">
                  {[
                    { href: SOCIAL.whatsapp, icon: FaWhatsapp, bg: 'var(--color-whatsapp)', label: 'WhatsApp' },
                    { href: SOCIAL.instagram, icon: FaInstagram, bg: 'linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)', label: 'Instagram' },
                    { href: SOCIAL.facebook, icon: FaFacebook, bg: '#1877F2', label: 'Facebook' },
                    { href: SOCIAL.youtube, icon: FaYoutube, bg: '#FF0000', label: 'YouTube' },
                    { href: SOCIAL.linkedin, icon: FaLinkedin, bg: '#0A66C2', label: 'LinkedIn' },
                  ].map(({ href, icon: Icon, bg, label }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 hover:shadow-lg"
                      style={{ background: bg }}
                      aria-label={label}
                    >
                      <Icon size={18} className="text-white" />
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Google Map Placeholder */}
          <motion.div
            className="mt-12 rounded-2xl overflow-hidden shadow-lg"
            style={{ height: '400px', border: '2px solid var(--color-pink-light)' }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <iframe
              src={`https://maps.google.com/maps?q=${encodeURIComponent(CONTACT.address)}&output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Sri Subhakari Fashions Location"
            />
          </motion.div>
        </div>
      </section>
    </div>
  )
}
