import { Link } from '@tanstack/react-router'
import { Instagram, Youtube, Linkedin, Facebook, MapPin, Phone, Mail, Clock, Heart } from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa'
import { SITE_NAME, SITE_TAGLINE, SOCIAL, CONTACT, NAV_LINKS } from '../../constants'
import { STATIC_CATEGORIES } from '../../constants/categories'
import { useState } from 'react'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setEmail('')
    }
  }

  const categories = STATIC_CATEGORIES

  return (
    <footer className="site-footer">
      {/* Main Footer */}
      <div className="container-brand px-4 sm:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <div className="flex flex-col">
                <span className="font-heading text-white text-2xl font-bold">{SITE_NAME}</span>
                <span
                  className="font-nav text-xs tracking-[0.25em] uppercase mt-0.5"
                  style={{ color: 'var(--color-gold)' }}
                >
                  {SITE_TAGLINE}
                </span>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              Discover the finest collection of sarees and ethnic wear — crafted with love,
              elegance, and centuries of tradition. Your trusted boutique for premium fashion.
            </p>
            {/* Social Icons */}
            <div className="flex gap-3 mb-5">
              <a
                href={SOCIAL.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                style={{ background: 'var(--color-whatsapp)' }}
                aria-label="WhatsApp"
              >
                <FaWhatsapp size={16} className="text-white" />
              </a>
              <a
                href={SOCIAL.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center transition-all duration-200 hover:scale-110"
                aria-label="Instagram"
              >
                <Instagram size={15} className="text-white" />
              </a>
              <a
                href={SOCIAL.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#1877F2] flex items-center justify-center transition-all duration-200 hover:scale-110"
                aria-label="Facebook"
              >
                <Facebook size={15} className="text-white" />
              </a>
              <a
                href={SOCIAL.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#FF0000] flex items-center justify-center transition-all duration-200 hover:scale-110"
                aria-label="YouTube"
              >
                <Youtube size={15} className="text-white" />
              </a>
              <a
                href={SOCIAL.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#0A66C2] flex items-center justify-center transition-all duration-200 hover:scale-110"
                aria-label="LinkedIn"
              >
                <Linkedin size={15} className="text-white" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-nav font-700 text-white text-sm tracking-widest uppercase mb-5"
              style={{ borderBottom: '2px solid var(--color-pink)', display: 'inline-block', paddingBottom: '4px' }}
            >
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors duration-200 flex items-center gap-1.5 group"
                  >
                    <span className="w-0 group-hover:w-3 overflow-hidden transition-all duration-200 inline-block h-0.5 rounded"
                      style={{ background: 'var(--color-pink)' }}
                    />
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href={SOCIAL.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white text-sm transition-colors duration-200 flex items-center gap-1.5 group"
                >
                  <span className="w-0 group-hover:w-3 overflow-hidden transition-all duration-200 inline-block h-0.5 rounded"
                    style={{ background: 'var(--color-pink)' }}
                  />
                  WhatsApp Enquiry
                </a>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-nav font-700 text-white text-sm tracking-widest uppercase mb-5"
              style={{ borderBottom: '2px solid var(--color-gold)', display: 'inline-block', paddingBottom: '4px' }}
            >
              Collections
            </h4>
            <ul className="space-y-2.5">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    to="/shop"
                    search={{ category: cat.slug }}
                    className="text-gray-400 hover:text-white text-sm transition-colors duration-200 flex items-center gap-1.5 group"
                  >
                    <span className="w-0 group-hover:w-3 overflow-hidden transition-all duration-200 inline-block h-0.5 rounded"
                      style={{ background: 'var(--color-gold)' }}
                    />
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h4 className="font-nav font-700 text-white text-sm tracking-widest uppercase mb-5"
              style={{ borderBottom: '2px solid var(--color-pink)', display: 'inline-block', paddingBottom: '4px' }}
            >
              Contact Us
            </h4>
            <ul className="space-y-3 mb-6">
              <li className="flex gap-3 text-sm text-gray-400">
                <MapPin size={15} className="mt-0.5 shrink-0" style={{ color: 'var(--color-gold)' }} />
                <span>{CONTACT.address}</span>
              </li>
              <li className="flex gap-3 text-sm text-gray-400">
                <Phone size={15} className="mt-0.5 shrink-0" style={{ color: 'var(--color-gold)' }} />
                <a href={`tel:${CONTACT.phone}`} className="hover:text-white transition-colors">
                  {CONTACT.phone}
                </a>
              </li>
              <li className="flex gap-3 text-sm text-gray-400">
                <Mail size={15} className="mt-0.5 shrink-0" style={{ color: 'var(--color-gold)' }} />
                <a href={`mailto:${CONTACT.email}`} className="hover:text-white transition-colors break-all">
                  {CONTACT.email}
                </a>
              </li>
              <li className="flex gap-3 text-sm text-gray-400">
                <Clock size={15} className="mt-0.5 shrink-0" style={{ color: 'var(--color-gold)' }} />
                <span>{CONTACT.businessHours}</span>
              </li>
            </ul>

            {/* Newsletter */}
            <h4 className="font-nav font-600 text-white text-xs tracking-widest uppercase mb-3">
              Newsletter
            </h4>
            {subscribed ? (
              <p className="text-sm" style={{ color: 'var(--color-whatsapp)' }}>
                ✓ Thank you for subscribing!
              </p>
            ) : (
              <form onSubmit={handleNewsletter} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  required
                  className="flex-1 bg-white/8 border border-white/15 rounded-full px-3 py-2 text-white placeholder:text-gray-500 text-xs focus:outline-none focus:border-pink-400"
                />
                <button
                  type="submit"
                  className="text-xs px-3 py-2 rounded-full font-600 font-nav text-white transition-all"
                  style={{ background: 'var(--color-pink)' }}
                >
                  Join
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/8">
        <div className="container-brand px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-500 text-xs text-center">
            © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
          </p>
          <p className="text-gray-600 text-xs flex items-center gap-1">
            Made with <Heart size={11} className="text-pink-500 fill-pink-500" /> in India
          </p>
        </div>
      </div>
    </footer>
  )
}
