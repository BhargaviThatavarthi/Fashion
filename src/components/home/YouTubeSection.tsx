import { motion } from 'framer-motion'
import { Youtube, ExternalLink } from 'lucide-react'
import { YOUTUBE_VIDEOS, SOCIAL } from '../../constants'
import type { YoutubeVideo } from '../../types'

interface YouTubeSectionProps {
  videos?: YoutubeVideo[]
}

export default function YouTubeSection({ videos }: YouTubeSectionProps) {
  const displayVideos = videos && videos.length > 0 ? videos : YOUTUBE_VIDEOS

  return (
    <section className="py-14 md:py-20 px-4 sm:px-6" style={{ background: '#0d0d0d' }}>
      <div className="container-brand">
        {/* Header */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span
            className="inline-block font-nav text-xs font-700 tracking-[0.2em] uppercase mb-3 px-4 py-1.5 rounded-full"
            style={{ color: '#FF0000', background: 'rgba(255,0,0,0.1)', border: '1px solid rgba(255,0,0,0.2)' }}
          >
            YouTube Channel
          </span>
          <h2
            className="font-heading text-white"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, lineHeight: 1.2 }}
          >
            Watch Our Latest{' '}
            <span className="italic" style={{ color: '#FF0000' }}>Videos</span>
          </h2>
          <p className="text-gray-400 text-sm mt-2 max-w-lg mx-auto">
            Explore saree draping tutorials, new collection unveils, styling tips and more on our YouTube channel.
          </p>
          <div className="gold-divider" />
        </motion.div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {displayVideos.map((video, i) => (
            <motion.div
              key={video.id}
              className="rounded-2xl overflow-hidden shadow-lg border border-white/5 bg-gray-900"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="relative aspect-video bg-gray-900">
                <iframe
                  src={`https://www.youtube.com/embed/${video.video_id}`}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full rounded-t-2xl border-0"
                  loading="lazy"
                />
              </div>
              <div className="px-4 py-3 min-h-[56px] flex items-center">
                <p className="text-white text-sm font-body font-500 line-clamp-2">{video.title}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Subscribe CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <a
            href={SOCIAL.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 font-nav font-700 text-white px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            style={{ background: '#FF0000', boxShadow: '0 4px 24px rgba(255,0,0,0.35)' }}
          >
            <Youtube size={22} />
            Subscribe to Our Channel
            <ExternalLink size={16} />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
