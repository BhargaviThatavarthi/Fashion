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
  {
    year: '2001',
    code: '01',
    content: (
      <>
        Sri Subhakari Fashions was founded with a passion for authentic sarees, serving customers through both{' '}
        <strong className="text-black font-bold">wholesale and retail</strong> with a commitment to quality and tradition.
      </>
    ),
  },
  {
    year: '2008',
    code: '02',
    content: (
      <>
        Expanded our collection with a wider range of{' '}
        <strong className="text-black font-bold">traditional, designer, and handcrafted sarees</strong>, building strong relationships with skilled weavers across South India.
      </>
    ),
  },
  {
    year: '2015',
    code: '03',
    content: (
      <>
        Grew our wholesale and retail presence, bringing beautiful sarees and ethnic wear to customers across different regions of India.
      </>
    ),
  },
  {
    year: '2021',
    code: '04',
    content: (
      <>
        Introduced a more personalized shopping experience, combining our traditional store service with modern customer engagement through{' '}
        <strong className="text-black font-bold">WhatsApp and online shopping</strong>.
      </>
    ),
  },
  {
    year: '2024',
    code: '05',
    content: (
      <>
        Launched our <strong className="text-black font-bold">premium digital boutique</strong>, bringing the Sri Subhakari Fashions store experience online while continuing our trusted wholesale and retail services.
      </>
    ),
  },
  {
    year: '2026',
    code: '06',
    content: (
      <>
        Today, Sri Subhakari Fashions continues its journey of blending{' '}
        <strong className="text-black font-bold">tradition, quality, and modern fashion</strong>, offering carefully selected sarees and ethnic wear for every occasion.
      </>
    ),
  },
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
      {/* Hero with Cinematic Background Video */}
      <section className="relative min-h-[500px] md:min-h-[560px] flex items-center justify-center overflow-hidden text-center px-4 py-20 bg-slate-950 text-white">
        {/* Background Video */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover object-center scale-105 transition-all duration-1000 brightness-90"
          >
            <source src="/videos/about-video.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Multi-layered Cinematic Gradient & Vignette Overlays */}
        <div className="absolute inset-0 z-[1] bg-slate-950/65 pointer-events-none" />
        <div className="absolute inset-0 z-[1] bg-gradient-to-t from-slate-950 via-transparent to-slate-950/80 pointer-events-none" />
        <div className="absolute inset-0 z-[1] bg-gradient-to-r from-slate-950/70 via-transparent to-slate-950/70 pointer-events-none" />
        <div
          className="absolute inset-0 z-[1] pointer-events-none opacity-40 mix-blend-screen"
          style={{
            background: 'radial-gradient(circle at center, rgba(236, 72, 153, 0.35) 0%, rgba(200, 164, 93, 0.2) 40%, transparent 75%)',
          }}
        />

        {/* Hero Content */}
        <div className="container-brand relative z-10 max-w-4xl mx-auto px-4 py-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight drop-shadow-xl mt-2">
              Our{' '}
              <span
                className="italic"
                style={{
                  background: 'linear-gradient(135deg, #f472b6, #fbbf24)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Story
              </span>
            </h1>

            <div className="gold-divider mx-auto my-4" />

            <p className="max-w-2xl mx-auto text-gray-200 text-base sm:text-lg md:text-xl font-normal leading-relaxed drop-shadow-md">
              A journey of passion, elegance, and timeless fashion — bringing the art of Indian ethnic wear
              to every woman who loves to celebrate her culture.
            </p>
          </motion.div>
        </div>
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
              <h2 className="section-heading mt-2 mb-5 !text-black">
                Sri Subhakari Fashions
              </h2>
              <p className="text-black leading-relaxed mb-4 font-normal">
                Welcome to <strong className="text-black font-bold">Sri Subhakari Fashions</strong>, your trusted destination for trendy and affordable fashion. We proudly offer both <strong className="text-black font-bold">wholesale and retail</strong> shopping, making us the perfect choice for individual customers, retailers, and bulk buyers.
              </p>
              <p className="text-black leading-relaxed mb-4 font-normal">
                We specialize in a wide range of <strong className="text-black font-bold">women's clothing</strong>, including stylish dresses, palazzo sets, kurtis, sarees, nightwear and many more fashionable collections. Whether you're looking for daily wear, office wear, festive outfits, or elegant traditional attire, we have something for every style and occasion.
              </p>
              <p className="text-black leading-relaxed mb-4 font-normal">
                At Sri Subhakari Fashions, we believe that everyone deserves quality fashion at affordable prices. That's why we carefully select our collections to ensure the latest designs, comfortable fabrics, and excellent craftsmanship. Our commitment to quality, customer satisfaction, and friendly service has helped us build lasting relationships with our customers.
              </p>
              <p className="text-black leading-relaxed mb-4 font-normal">
                Whether you're shopping for yourself or purchasing in bulk for your business, Sri Subhakari Fashions is dedicated to providing the best products at the best prices.
              </p>
              <p className="font-heading font-bold leading-relaxed text-pink-700 mt-6">
                Sri Subhakari Fashions – Where Style Meets Quality, and Fashion Becomes Affordable.
              </p>
            </motion.div>

            {/* Story Showcase Image/Video with Luxury Designer Shape */}
            <motion.div
              className="relative flex items-center justify-center py-6"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              {/* Glowing ambient backlight in theme colors */}
              <div
                className="absolute inset-0 rounded-full scale-110 opacity-70 blur-3xl pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(192, 125, 196, 0.45) 0%, rgba(56, 189, 248, 0.3) 50%, transparent 75%)',
                }}
              />

              <div className="relative w-full max-w-[500px] aspect-[4/3] sm:aspect-[1.18] group">
                {/* Decorative Offset Gold Frame */}
                <div
                  className="absolute inset-0 rounded-[50px_140px_50px_140px] translate-x-3.5 translate-y-3.5 border-2 border-amber-400/50 bg-gradient-to-br from-pink-500/10 to-amber-500/10 pointer-events-none transition-transform duration-700 group-hover:translate-x-5 group-hover:translate-y-5 shadow-lg"
                />

                {/* Main Image Container */}
                <div
                  className="relative z-10 w-full h-full rounded-[50px_140px_50px_140px] overflow-hidden shadow-2xl border-2 transition-all duration-700 group-hover:-translate-y-1"
                  style={{
                    borderColor: 'rgba(216, 92, 138, 0.4)',
                    boxShadow: '0 25px 60px -10px rgba(192, 125, 196, 0.4), 0 0 0 1px rgba(212, 168, 83, 0.3)',
                  }}
                >
                  <img
                    src="/images/about-us.jpg"
                    alt="Welcome to Sri Subhakari Fashions"
                    className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700"
                  />

                  {/* Subtle luxury shine overlay */}
                  <div
                    className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/15 opacity-60 group-hover:opacity-30 transition-opacity pointer-events-none"
                  />
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
            <h2 className="section-heading mt-2 !text-black">What We Stand For</h2>
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
                  <h3 className="font-heading font-bold text-black mb-2">{val.title}</h3>
                  <p className="text-black text-sm leading-relaxed font-normal">{val.desc}</p>
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
            <h2 className="section-heading mt-2 !text-black">Milestones &amp; Memories</h2>
            <div className="gold-divider" />
          </motion.div>

          <div className="relative max-w-2xl mx-auto">
            {/* Vertical line */}
            <div
              className="absolute left-6 top-2 bottom-2 w-0.5"
              style={{ background: 'linear-gradient(to bottom, #b83280, #c045c7)' }}
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
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white text-sm font-sans font-bold shadow-md shadow-pink-500/20"
                      style={{ background: 'linear-gradient(135deg, #b83280, #802080)' }}
                    >
                      {item.code}
                    </div>
                  </div>
                  {/* Content Card */}
                  <div className="premium-card p-6 flex-1 rounded-2xl border border-pink-100/80 shadow-sm bg-white hover:shadow-md transition-shadow">
                    <div className="font-sans font-bold text-xl mb-2 tracking-tight" style={{ color: '#b83280' }}>
                      {item.year}
                    </div>
                    <div className="text-black text-sm sm:text-[15px] leading-relaxed font-normal">
                      {item.content}
                    </div>
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
