import { useEffect, useState } from 'react'
import { FaWhatsapp } from 'react-icons/fa'
import { ArrowUp } from 'lucide-react'
import { CONTACT } from '../../constants'
import { motion, AnimatePresence } from 'framer-motion'

export function WhatsAppFab() {
  return (
    <motion.a
      href={`https://wa.me/${CONTACT.whatsapp.replace(/[^0-9]/g, '')}`}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-fab"
      aria-label="Enquire on WhatsApp"
      whileHover={{ scale: 1.12 }}
      whileTap={{ scale: 0.96 }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 1.5 }}
    >
      <FaWhatsapp size={28} />
    </motion.a>
  )
}

export function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          onClick={scrollToTop}
          className="back-to-top"
          aria-label="Back to top"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          whileHover={{ translateY: -3 }}
          whileTap={{ scale: 0.9 }}
        >
          <ArrowUp size={18} />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
