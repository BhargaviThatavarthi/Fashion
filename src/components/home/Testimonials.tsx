import { useState } from 'react'
import { motion } from 'framer-motion'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import { DEMO_TESTIMONIALS } from '../../types'

export default function Testimonials() {
  const testimonials = DEMO_TESTIMONIALS
  const [active, setActive] = useState(0)

  const prev = () => setActive((a) => (a - 1 + testimonials.length) % testimonials.length)
  const next = () => setActive((a) => (a + 1) % testimonials.length)

  return (
    <section className="py-14 md:py-20 px-4 sm:px-6" style={{ background: '#FFFFFF' }}>
      <div className="container-brand">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-badge">Customer Love</span>
          <h2 className="section-heading">What Our Customers Say</h2>
          <div className="gold-divider" />
        </motion.div>

        {/* Testimonial Carousel */}
        <div className="relative max-w-4xl mx-auto">
          <motion.div
            key={active}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.4 }}
            className="premium-card p-8 md:p-12 text-center"
          >
            {/* Quote icon */}
            <div className="flex justify-center mb-6">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, var(--color-pink), var(--color-pink-dark))' }}
              >
                <Quote size={24} className="text-white" />
              </div>
            </div>

            {/* Stars */}
            <div className="flex justify-center gap-1 mb-5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={20}
                  className={
                    star <= testimonials[active].rating
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-200 fill-gray-200'
                  }
                />
              ))}
            </div>

            {/* Review */}
            <blockquote className="font-body text-gray-600 text-base md:text-lg leading-relaxed mb-6 italic max-w-2xl mx-auto">
              "{testimonials[active].review}"
            </blockquote>

            {/* Customer */}
            <div className="flex flex-col items-center">
              <div
                className="w-14 h-14 rounded-full mb-3 flex items-center justify-center text-white text-xl font-bold"
                style={{ background: 'linear-gradient(135deg, var(--color-pink), var(--color-gold))' }}
              >
                {testimonials[active].customer_name.charAt(0)}
              </div>
              <p className="font-heading font-600 text-gray-800">
                {testimonials[active].customer_name}
              </p>
              <p className="text-xs font-nav text-gray-400 mt-0.5">Verified Customer</p>
            </div>
          </motion.div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-200 hover:text-white"
              style={{ borderColor: 'var(--color-pink)', color: 'var(--color-pink)' }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLButtonElement).style.background = 'var(--color-pink)'
                ;(e.currentTarget as HTMLButtonElement).style.color = 'white'
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLButtonElement).style.background = ''
                ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--color-pink)'
              }}
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={18} />
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className="w-2 h-2 rounded-full transition-all duration-200"
                  style={{
                    background: i === active ? 'var(--color-pink)' : 'var(--color-pink-light)',
                    transform: i === active ? 'scale(1.4)' : 'scale(1)',
                  }}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-200"
              style={{ borderColor: 'var(--color-pink)', color: 'var(--color-pink)' }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLButtonElement).style.background = 'var(--color-pink)'
                ;(e.currentTarget as HTMLButtonElement).style.color = 'white'
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLButtonElement).style.background = ''
                ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--color-pink)'
              }}
              aria-label="Next testimonial"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
