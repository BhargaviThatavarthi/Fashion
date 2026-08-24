import { motion } from 'framer-motion'
import { WHY_CHOOSE_US } from '../../constants'
import { Shield, Sparkles, MessageCircle, Truck, RotateCcw, Award, ShieldCheck } from 'lucide-react'

const ICON_MAP: Record<string, React.ElementType> = {
  Shield,
  Sparkles,
  MessageCircle,
  TruckIcon: Truck,
  RotateCcw,
  Award,
  ShieldCheck,
}

export default function WhyChooseUs() {
  return (
    <section
      className="py-14 md:py-20 px-4 sm:px-6"
      style={{ background: 'var(--color-header)' }}
    >
      <div className="container-brand">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span
            className="inline-block font-nav text-xs font-700 tracking-[0.2em] uppercase mb-3 px-4 py-1.5 rounded-full"
            style={{ color: 'var(--color-gold)', background: 'rgba(200,164,93,0.12)', border: '1px solid rgba(200,164,93,0.3)' }}
          >
            ✦ Our Promise
          </span>
          <h2
            className="font-heading text-white"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, lineHeight: 1.2 }}
          >
            Why Choose{' '}
            <span
              className="italic"
              style={{
                background: 'linear-gradient(135deg, var(--color-pink), var(--color-gold))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Sri Subhakari?
            </span>
          </h2>
          <div className="gold-divider" />
        </motion.div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {WHY_CHOOSE_US.map((feature, i) => {
            const Icon = ICON_MAP[feature.icon] || Shield
            return (
              <motion.div
                key={feature.title}
                className="group rounded-2xl p-6 border border-white/8 hover:border-pink-500/30 transition-all duration-300"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  backdropFilter: 'blur(8px)',
                }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ translateY: -4, background: 'rgba(216,92,138,0.06)' }}
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110"
                  style={{
                    background: 'linear-gradient(135deg, rgba(216,92,138,0.15), rgba(200,164,93,0.15))',
                    border: '1px solid rgba(216,92,138,0.25)',
                  }}
                >
                  <Icon
                    size={22}
                    style={{
                      background: 'linear-gradient(135deg, var(--color-pink), var(--color-gold))',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  />
                </div>
                <h3 className="font-heading text-white text-lg font-600 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
