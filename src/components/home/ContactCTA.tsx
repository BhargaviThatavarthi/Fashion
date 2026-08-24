import { motion } from 'framer-motion'
import { Link } from '@tanstack/react-router'
import { FaWhatsapp } from 'react-icons/fa'
import { ArrowRight } from 'lucide-react'
import { CONTACT } from '../../constants'

export default function ContactCTA() {
  return (
    <section className="py-14 md:py-20 px-4 sm:px-6" style={{ background: 'var(--color-bg)' }}>
      <div className="container-brand">
        <motion.div
          className="rounded-3xl p-8 md:p-14 text-center relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #FFFFFF 0%, #FFFFFF 50%, var(--color-gold-light) 100%)',
            border: '2px solid rgba(216,92,138,0.15)',
          }}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          {/* Decorative circles */}
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-20 pointer-events-none"
            style={{ background: 'radial-gradient(circle, var(--color-pink), transparent)' }} />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full opacity-15 pointer-events-none"
            style={{ background: 'radial-gradient(circle, var(--color-gold), transparent)' }} />

          <div className="relative z-10">
            <span className="section-badge">Get in Touch</span>
            <h2 className="section-heading mb-4">
              Ready to Find Your{' '}
              <span className="italic" style={{ color: 'var(--color-pink)' }}>Perfect Saree?</span>
            </h2>
            <p className="section-subtitle max-w-lg mx-auto mb-8">
              Our fashion experts are here to help you choose the perfect ethnic wear for any occasion.
              Contact us on WhatsApp or visit our store today!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`https://wa.me/${CONTACT.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="btn-whatsapp px-8 py-3.5 flex items-center gap-2 justify-center">
                  <FaWhatsapp size={20} />
                  Chat on WhatsApp
                </button>
              </a>
              <Link to="/contact">
                <button className="btn-outline-pink px-8 py-3.5 flex items-center gap-2 justify-center">
                  Contact Us
                  <ArrowRight size={16} />
                </button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
