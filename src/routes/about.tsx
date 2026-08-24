import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { Target, Eye, Award, Sparkles, Gem, HeartHandshake, ShieldCheck } from 'lucide-react'

export const Route = createFileRoute('/about')({
  head: () => ({
    meta: [
      { title: 'About Us — Sri Subhakari Fashions' },
      {
        name: 'description',
        content:
          'Learn about Sri Subhakari Fashions — our story, mission, values, and commitment to delivering premium sarees and ethnic wear crafted with elegance and tradition.',
      },
    ],
  }),
  component: AboutPage,
})

const TIMELINE = [
  { year: '2010', event: 'Sri Subhakari Fashions was founded with a vision to bring authentic handcrafted sarees to modern women.' },
  { year: '2014', event: 'Expanded to designer and bridal wear, partnering with master weavers across South India.' },
  { year: '2018', event: 'Launched our online presence and started pan-India delivery through trusted logistics.' },
  { year: '2021', event: 'Crossed 5,000+ happy customers milestone. Introduced WhatsApp-first shopping experience.' },
  { year: '2024', event: 'Launched our premium digital boutique — bringing the store experience online with a personal touch.' },
]

const VALUES = [
  { icon: Sparkles, title: 'Authenticity', desc: 'We source only genuine handcrafted pieces from verified artisans and weavers.' },
  { icon: Gem, title: 'Quality', desc: 'Every saree and outfit is personally curated and quality-checked before dispatch.' },
  { icon: ShieldCheck, title: 'Tradition', desc: 'We celebrate India\'s rich textile heritage while embracing contemporary design.' },
  { icon: HeartHandshake, title: 'Trust', desc: 'Building lasting relationships with our customers through transparency and care.' },
]

function AboutPage() {
  return (
    <div style={{ background: 'var(--color-bg)' }}>
      {/* Hero */}
      <section
        className="relative py-20 md:py-28 text-center px-4"
        style={{ background: '#FFFFFF' }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <span className="section-badge">About Us</span>
          <h1 className="section-heading mt-2">
            Our{' '}
            <span
              className="italic"
              style={{
                background: 'linear-gradient(135deg, var(--color-pink), var(--color-gold))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Story
            </span>
          </h1>
          <div className="gold-divider" />
          <p className="section-subtitle max-w-2xl mx-auto mt-4">
            A journey of passion, elegance, and timeless fashion — bringing the art of Indian ethnic wear
            to every woman who loves to celebrate her culture.
          </p>
        </motion.div>
      </section>

      {/* Story Section */}
      <section className="py-14 md:py-20 px-4 sm:px-6">
        <div className="container-brand">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <span className="section-badge">About Us</span>
              <h2 className="section-heading mt-2 mb-5">
                Sri Subhakari Fashions
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Welcome to <strong>Sri Subhakari Fashions</strong>, your trusted destination for trendy and affordable fashion. We proudly offer both <strong>wholesale and retail</strong> shopping, making us the perfect choice for individual customers, retailers, and bulk buyers.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                We specialize in a wide range of <strong>women's clothing</strong>, including stylish dresses, palazzo sets, kurtis, sarees, nightwear and many more fashionable collections. Whether you're looking for daily wear, office wear, festive outfits, or elegant traditional attire, we have something for every style and occasion.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                At Sri Subhakari Fashions, we believe that everyone deserves quality fashion at affordable prices. That's why we carefully select our collections to ensure the latest designs, comfortable fabrics, and excellent craftsmanship. Our commitment to quality, customer satisfaction, and friendly service has helped us build lasting relationships with our customers.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                Whether you're shopping for yourself or purchasing in bulk for your business, Sri Subhakari Fashions is dedicated to providing the best products at the best prices.
              </p>
              <p className="font-heading font-700 leading-relaxed text-pink-600 mt-6" style={{ color: 'var(--color-pink)' }}>
                Sri Subhakari Fashions – Where Style Meets Quality, and Fashion Becomes Affordable.
              </p>
            </motion.div>

            {/* Founder Image Placeholder */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div
                className="rounded-[40%_60%_60%_40%/50%_40%_60%_50%] overflow-hidden"
                style={{
                  height: '450px',
                  background: 'linear-gradient(135deg, var(--color-pink-light), var(--color-pink), var(--color-gold))',
                  boxShadow: '0 20px 60px rgba(216,92,138,0.2)',
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1594938298603-c8148c4b4889?w=500&q=80"
                  alt="Our founder in traditional saree"
                  className="w-full h-full object-cover mix-blend-overlay opacity-60"
                />
                <div className="absolute inset-0 flex items-center justify-center text-white text-8xl">
                  🥻
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission, Vision */}
      <section className="py-14 px-4 sm:px-6" style={{ background: '#0d0d0d' }}>
        <div className="container-brand">
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2
              className="font-heading text-white"
              style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700 }}
            >
              Mission &amp; Vision
            </h2>
            <div className="gold-divider" />
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: Target,
                title: 'Our Mission',
                color: 'var(--color-pink)',
                text: 'To make premium, authentic Indian ethnic wear accessible to every woman — celebrating culture, craftsmanship, and confidence through our curated collections.',
              },
              {
                icon: Eye,
                title: 'Our Vision',
                color: 'var(--color-gold)',
                text: 'To become India\'s most trusted boutique for ethnic wear — where every customer finds not just a saree, but a piece of art that tells her story.',
              },
            ].map(({ icon: Icon, title, color, text }, i) => (
              <motion.div
                key={title}
                className="rounded-2xl p-8"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                  style={{ background: `rgba(${color === 'var(--color-pink)' ? '216,92,138' : '200,164,93'},0.15)` }}
                >
                  <Icon size={26} style={{ color }} />
                </div>
                <h3 className="font-heading text-white text-xl font-600 mb-3">{title}</h3>
                <p className="text-gray-400 leading-relaxed">{text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-14 px-4 sm:px-6">
        <div className="container-brand">
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="section-badge">Our Values</span>
            <h2 className="section-heading mt-2">What We Stand For</h2>
            <div className="gold-divider" />
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {VALUES.map((val, i) => {
              const IconComp = val.icon
              return (
                <motion.div
                  key={val.title}
                  className="premium-card p-6 text-center flex flex-col items-center"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="w-12 h-12 rounded-2xl bg-pink-50 border border-pink-100 flex items-center justify-center text-pink-600 mb-3">
                    <IconComp size={24} />
                  </div>
                  <h3 className="font-heading font-700 text-gray-800 mb-2">{val.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{val.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-14 px-4 sm:px-6" style={{ background: '#FFFFFF' }}>
        <div className="container-brand">
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="section-badge">Our Journey</span>
            <h2 className="section-heading mt-2">Milestones &amp; Memories</h2>
            <div className="gold-divider" />
          </motion.div>

          <div className="relative max-w-2xl mx-auto">
            {/* Vertical line */}
            <div
              className="absolute left-6 top-2 bottom-2 w-0.5"
              style={{ background: 'linear-gradient(to bottom, var(--color-pink), var(--color-gold))' }}
            />

            <div className="space-y-8">
              {TIMELINE.map((item, i) => (
                <motion.div
                  key={item.year}
                  className="flex gap-6 relative"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ delay: i * 0.12 }}
                >
                  {/* Year dot */}
                  <div className="shrink-0 relative z-10">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xs font-nav font-700"
                      style={{ background: 'linear-gradient(135deg, var(--color-pink), var(--color-gold))' }}
                    >
                      {item.year.slice(2)}
                    </div>
                  </div>
                  {/* Content */}
                  <div className="premium-card p-5 flex-1">
                    <div className="font-heading font-700 text-lg mb-1" style={{ color: 'var(--color-pink)' }}>
                      {item.year}
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">{item.event}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quality Promise */}
      <section className="py-12 px-4 sm:px-6" style={{ background: 'var(--color-header)' }}>
        <div className="container-brand text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <Award size={48} className="mx-auto mb-4" style={{ color: 'var(--color-gold)' }} />
            <h2 className="font-heading text-white text-3xl font-700 mb-4">Our Quality Promise</h2>
            <p className="text-gray-300 leading-relaxed mb-6">
              Every garment is inspected for quality, authenticity, and craftsmanship before it reaches you.
              We are committed to delivering nothing less than perfection — because you deserve the finest.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {['✓ Authentic Handcraft', '✓ Quality Certified', '✓ 100% Quality Inspected', '✓ Pan-India Delivery'].map((item) => (
                <span
                  key={item}
                  className="px-4 py-2 rounded-full text-sm font-nav font-600"
                  style={{ background: 'rgba(216,92,138,0.15)', color: 'var(--color-pink)', border: '1px solid rgba(216,92,138,0.3)' }}
                >
                  {item}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
