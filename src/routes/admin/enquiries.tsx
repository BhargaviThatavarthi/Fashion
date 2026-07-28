import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { getEnquiries, markEnquiryRead } from '../../services/enquiries'
import { timeAgo } from '../../utils/format'

export const Route = createFileRoute('/admin/enquiries')({
  component: AdminEnquiries,
})

function AdminEnquiries() {
  const { data: enquiries, isLoading, refetch } = useQuery({
    queryKey: ['enquiries'],
    queryFn: getEnquiries,
    enabled: !!import.meta.env.VITE_SUPABASE_URL,
  })

  if (!import.meta.env.VITE_SUPABASE_URL) {
    return (
      <div>
        <h1 className="font-heading text-2xl font-700 text-gray-800 mb-6">Enquiries</h1>
        <div className="bg-white rounded-2xl p-10 text-center shadow-sm border" style={{ borderColor: '#f0e0e8' }}>
          <div className="text-4xl mb-3">🔧</div>
          <p className="text-gray-500 text-sm">
            Connect Supabase to view customer enquiries. Add your Supabase credentials to the <code>.env</code> file.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl font-700 text-gray-800">Enquiries</h1>
          <p className="text-gray-500 text-sm mt-0.5">{enquiries?.length || 0} total enquiries</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden" style={{ borderColor: '#f0e0e8' }}>
        {isLoading ? (
          <div className="p-10 text-center text-gray-400">Loading enquiries...</div>
        ) : !enquiries?.length ? (
          <div className="p-10 text-center">
            <div className="text-4xl mb-3">📬</div>
            <p className="text-gray-400">No enquiries yet.</p>
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: '#fde8f0' }}>
            {enquiries.map((enq, i) => (
              <motion.div
                key={enq.id}
                className={`p-5 hover:bg-gray-50/50 transition-colors ${!enq.read ? 'bg-pink-50/30' : ''}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-nav font-700 text-sm text-gray-800">{enq.name}</p>
                      {!enq.read && (
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ background: 'var(--color-pink)' }} />
                      )}
                    </div>
                    {enq.product_name && (
                      <p className="text-xs mb-1" style={{ color: 'var(--color-gold)' }}>
                        Product: {enq.product_name}
                      </p>
                    )}
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{enq.message}</p>
                    <div className="flex gap-4 text-xs text-gray-400">
                      {enq.phone && <span>📞 {enq.phone}</span>}
                      {enq.email && <span>✉️ {enq.email}</span>}
                      {enq.created_at && <span>{timeAgo(enq.created_at)}</span>}
                    </div>
                  </div>
                  {!enq.read && (
                    <button
                      onClick={() => markEnquiryRead(enq.id).then(() => refetch())}
                      className="shrink-0 text-xs font-nav font-600 px-3 py-1.5 rounded-lg border transition-colors"
                      style={{ borderColor: 'var(--color-pink-light)', color: 'var(--color-pink)' }}
                    >
                      Mark Read
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
