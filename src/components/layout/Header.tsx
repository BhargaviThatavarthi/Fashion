'use client'
import { useState, useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Search, Instagram, Youtube, ShoppingBag } from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa'
import { NAV_LINKS, SOCIAL, CONTACT } from '../../constants'
import { useCart } from '../../context/CartContext'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { totalItems, openCart } = useCart()

  useEffect(() => {
    const handler = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/shop?search=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#1f0b24]/98 backdrop-blur-md shadow-lg shadow-black/20'
            : 'bg-[#1f0b24]'
        }`}
      >
        <div className="container-brand px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="flex flex-col leading-tight">
                <span className="font-heading text-white text-base md:text-xl font-bold tracking-wide">
                  Sri Subhakari
                </span>
                <span
                  className="font-nav text-xs md:text-sm tracking-[0.25em] uppercase"
                  style={{ color: 'var(--color-gold)' }}
                >
                  Fashions
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="font-nav text-sm sm:text-base font-bold font-700 text-gray-100 hover:text-white relative group transition-colors duration-200 tracking-wide"
                  activeProps={{ className: 'text-white font-bold' }}
                >
                  <span className="relative">
                    {link.label}
                    <span
                      className="absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300"
                      style={{ background: 'linear-gradient(90deg, var(--color-pink), var(--color-gold))' }}
                    />
                  </span>
                </Link>
              ))}
            </nav>

            {/* Right Icons */}
            <div className="hidden md:flex items-center gap-3">
              {/* Search */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="text-gray-300 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10 cursor-pointer"
                aria-label="Search"
              >
                <Search size={18} />
              </button>

              {/* Shopping Cart Button */}
              <button
                onClick={openCart}
                className="relative text-gray-200 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10 flex items-center justify-center cursor-pointer"
                aria-label="Shopping Cart"
                id="header-cart-btn"
              >
                <ShoppingBag size={20} />
                {totalItems > 0 && (
                  <span
                    className="absolute -top-0.5 -right-0.5 min-w-[19px] h-[19px] px-1 rounded-full text-[10px] font-bold font-nav flex items-center justify-center text-white shadow-md animate-pulse"
                    style={{ background: 'var(--color-pink)' }}
                  >
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </button>

              {/* Social Icons */}
              <a
                href={SOCIAL.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
                aria-label="WhatsApp"
                style={{ color: 'var(--color-whatsapp)' }}
              >
                <FaWhatsapp size={18} />
              </a>
              <a
                href={SOCIAL.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-red-500 p-2 rounded-full hover:bg-white/10 transition-colors"
                aria-label="YouTube"
              >
                <Youtube size={18} />
              </a>
              <a
                href={SOCIAL.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 p-2 rounded-full hover:bg-white/10 transition-colors"
                aria-label="Instagram"
                style={{ color: 'inherit' }}
              >
                <Instagram size={18} className="hover:text-pink-400 transition-colors" />
              </a>

              {/* WhatsApp Enquiry CTA */}
              <a
                href={`https://wa.me/${CONTACT.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp text-sm px-4 py-2 flex items-center gap-2 ml-2"
              >
                <FaWhatsapp size={15} />
                <span className="hidden lg:inline">Enquire Now</span>
              </a>
            </div>

            {/* Mobile Actions (Cart + Menu Toggle) */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={openCart}
                className="relative text-white p-2 rounded-full hover:bg-white/10"
                aria-label="Shopping Cart"
              >
                <ShoppingBag size={21} />
                {totalItems > 0 && (
                  <span
                    className="absolute top-0 right-0 min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold font-nav flex items-center justify-center text-white shadow-md"
                    style={{ background: 'var(--color-pink)' }}
                  >
                    {totalItems}
                  </span>
                )}
              </button>

              <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="text-white p-2"
                aria-label="Toggle menu"
              >
                {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>

          {/* Search Bar (Desktop) */}
          <AnimatePresence>
            {isSearchOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="pb-3"
              >
                <form onSubmit={handleSearch} className="flex gap-2">
                  <input
                    autoFocus
                    type="text"
                    placeholder="Search sarees, lehengas, kurtis..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-white placeholder:text-gray-400 text-sm focus:outline-none focus:border-pink-400"
                  />
                  <button
                    type="submit"
                    className="btn-pink px-4 py-2 text-sm"
                  >
                    Search
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-black/60 z-40 md:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 left-0 bottom-0 w-80 bg-[#111111] z-50 md:hidden flex flex-col"
            >
              {/* Mobile Header */}
              <div className="flex items-center justify-between p-5 border-b border-white/10">
                <div className="flex flex-col">
                  <span className="font-heading text-white text-lg font-bold">Sri Subhakari</span>
                  <span className="font-nav text-xs tracking-[0.2em] uppercase" style={{ color: 'var(--color-gold)' }}>
                    Fashions
                  </span>
                </div>
                <button onClick={() => setIsMobileOpen(false)} className="text-gray-400 p-1">
                  <X size={22} />
                </button>
              </div>

              {/* Mobile Search */}
              <div className="p-4 border-b border-white/10">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    setIsMobileOpen(false)
                    handleSearch(e)
                  }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-white/10 border border-white/20 rounded-full px-3 py-2 text-white placeholder:text-gray-400 text-sm focus:outline-none focus:border-pink-400"
                  />
                  <button type="submit" className="btn-pink px-3 py-2">
                    <Search size={15} />
                  </button>
                </form>
              </div>

              {/* Mobile Nav Links */}
              <nav className="flex-1 p-5 flex flex-col gap-1">
                {NAV_LINKS.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                  >
                    <Link
                      to={link.href}
                      onClick={() => setIsMobileOpen(false)}
                      className="block font-nav font-bold font-700 text-base text-white hover:text-pink-300 py-3 px-3 rounded-xl hover:bg-white/8 transition-all"
                      activeProps={{ style: { color: 'var(--color-pink)', background: 'rgba(216,92,138,0.15)', fontWeight: 'bold' } }}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}

                {/* Mobile Cart Link */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: NAV_LINKS.length * 0.07 }}
                >
                  <Link
                    to="/cart"
                    onClick={() => setIsMobileOpen(false)}
                    className="flex items-center justify-between font-nav font-bold font-700 text-base text-white hover:text-pink-300 py-3 px-3 rounded-xl hover:bg-white/8 transition-all"
                    activeProps={{ style: { color: 'var(--color-pink)', background: 'rgba(216,92,138,0.15)', fontWeight: 'bold' } }}
                  >
                    <div className="flex items-center gap-2">
                      <ShoppingBag size={18} />
                      <span>Shopping Cart</span>
                    </div>
                    {totalItems > 0 && (
                      <span
                        className="px-2 py-0.5 rounded-full text-xs font-bold font-nav"
                        style={{ background: 'var(--color-pink)', color: 'white' }}
                      >
                        {totalItems}
                      </span>
                    )}
                  </Link>
                </motion.div>
              </nav>

              {/* Mobile Social */}
              <div className="p-5 border-t border-white/10">
                <p className="font-nav text-xs text-gray-500 uppercase tracking-widest mb-3">Follow Us</p>
                <div className="flex gap-4">
                  <a href={SOCIAL.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                    <FaWhatsapp size={22} style={{ color: 'var(--color-whatsapp)' }} />
                  </a>
                  <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-pink-400" aria-label="Instagram">
                    <Instagram size={20} />
                  </a>
                  <a href={SOCIAL.youtube} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-red-500" aria-label="YouTube">
                    <Youtube size={20} />
                  </a>
                </div>

                <a
                  href={`https://wa.me/${CONTACT.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp mt-4 flex items-center justify-center gap-2 w-full"
                >
                  <FaWhatsapp size={18} />
                  Enquire on WhatsApp
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer for sticky header */}
      <div className="h-16 md:h-20" />
    </>
  )
}
