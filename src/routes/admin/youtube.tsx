import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Trash2, Youtube, RefreshCw, CheckCircle, Link2, Unlink, Loader2 } from 'lucide-react'
import {
  getYoutubeConnectionStatus,
  getYoutubeAuthUrl,
  disconnectYoutube,
  getYoutubeVideos,
  saveYoutubeVideos,
  syncYoutubeVideos,
} from '../../services/youtube'
import type { YoutubeVideo } from '../../types'

export const Route = createFileRoute('/admin/youtube')({
  component: AdminYoutube,
})

function AdminYoutube() {
  const queryClient = useQueryClient()
  const [form, setForm] = useState({ title: '', video_id: '' })
  const [showForm, setShowForm] = useState(false)
  const [localVideos, setLocalVideos] = useState<YoutubeVideo[]>([])
  const [isDirty, setIsDirty] = useState(false)

  // 1. Fetch connection status
  const { data: status, isLoading: loadingStatus } = useQuery({
    queryKey: ['youtube-connection'],
    queryFn: getYoutubeConnectionStatus,
  })

  // 2. Fetch saved videos
  const { data: serverVideos, isLoading: loadingVideos } = useQuery({
    queryKey: ['youtube-videos-admin'],
    queryFn: getYoutubeVideos,
  })

  // Keep local state in sync with server state initially
  useEffect(() => {
    if (serverVideos) {
      setLocalVideos(serverVideos)
      setIsDirty(false)
    }
  }, [serverVideos])

  // 3. Connect Channel Mutation
  const connectMutation = useMutation({
    mutationFn: async () => {
      const authUrl = await getYoutubeAuthUrl()
      window.location.href = authUrl
    },
  })

  // 4. Disconnect Channel Mutation
  const disconnectMutation = useMutation({
    mutationFn: disconnectYoutube,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['youtube-connection'] })
    },
  })

  // 5. Sync Videos Mutation
  const syncMutation = useMutation({
    mutationFn: syncYoutubeVideos,
    onSuccess: (data) => {
      queryClient.setQueryData(['youtube-videos-admin'], data)
      setLocalVideos(data)
      setIsDirty(false)
      queryClient.invalidateQueries({ queryKey: ['youtube-videos'] })
    },
  })

  // 6. Save Videos Mutation (for manual changes)
  const saveMutation = useMutation({
    mutationFn: saveYoutubeVideos,
    onSuccess: (data) => {
      queryClient.setQueryData(['youtube-videos-admin'], data)
      setLocalVideos(data)
      setIsDirty(false)
      queryClient.invalidateQueries({ queryKey: ['youtube-videos'] })
    },
  })

  const add = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title || !form.video_id) return
    const newVideo: YoutubeVideo = {
      id: `manual-${Date.now()}`,
      title: form.title,
      video_id: form.video_id,
      thumbnail: `https://img.youtube.com/vi/${form.video_id}/mqdefault.jpg`,
      sort_order: localVideos.length,
      created_at: new Date().toISOString(),
    }
    const updated = [...localVideos, newVideo]
    setLocalVideos(updated)
    setIsDirty(true)
    setForm({ title: '', video_id: '' })
    setShowForm(false)
  }

  const remove = (id: string) => {
    const updated = localVideos.filter(vid => vid.id !== id)
    setLocalVideos(updated)
    setIsDirty(true)
  }

  const handleSaveManualChanges = () => {
    saveMutation.mutate(localVideos)
  }

  const handleResetManualChanges = () => {
    if (serverVideos) {
      setLocalVideos(serverVideos)
      setIsDirty(false)
    }
  }

  if (loadingStatus || loadingVideos) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-10 h-10 text-pink-600 animate-spin mb-4" />
        <p className="text-gray-500 font-body">Loading YouTube management dashboard...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-700 text-gray-800 flex items-center gap-2.5">
            <Youtube className="text-red-600" size={28} />
            YouTube Channel Integration
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Connect your official YouTube channel to synchronize video uploads automatically or manage custom videos.
          </p>
        </div>
      </div>

      {/* Connection Info Block */}
      {!status?.configured ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5 text-yellow-800 font-body text-sm">
          <p className="font-600 mb-1">⚠️ YouTube API Credentials Not Configured</p>
          <p>
            Please set the <code className="bg-yellow-100 px-1 py-0.5 rounded font-mono">GOOGLE_CLIENT_ID</code>,{' '}
            <code className="bg-yellow-100 px-1 py-0.5 rounded font-mono">GOOGLE_CLIENT_SECRET</code>, and{' '}
            <code className="bg-yellow-100 px-1 py-0.5 rounded font-mono">GOOGLE_REDIRECT_URI</code> variables in your{' '}
            <code className="font-mono">.env</code> file to enable Google OAuth connection.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {/* Status Panel */}
          <div className="md:col-span-1 bg-white rounded-2xl p-6 shadow-sm border" style={{ borderColor: '#f0e0e8' }}>
            <h2 className="font-heading text-lg font-700 text-gray-800 mb-4">Connection</h2>

            {status.connected ? (
              <div className="space-y-5">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-50 rounded-xl text-green-600 border border-green-100">
                    <CheckCircle size={24} />
                  </div>
                  <div>
                    <p className="font-nav text-xs font-700 text-gray-400 uppercase tracking-wider">Status</p>
                    <p className="font-body font-600 text-green-600 text-sm">Connected</p>
                    {status.channelTitle && (
                      <p className="font-body text-gray-800 font-500 mt-1 text-sm">{status.channelTitle}</p>
                    )}
                  </div>
                </div>

                <div className="pt-2 flex flex-col gap-2.5">
                  <button
                    onClick={() => syncMutation.mutate()}
                    disabled={syncMutation.isPending}
                    className="btn-pink w-full px-4 py-2.5 text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {syncMutation.isPending ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <RefreshCw size={16} />
                    )}
                    Sync Channel Uploads
                  </button>

                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to disconnect your YouTube channel?')) {
                        disconnectMutation.mutate()
                      }
                    }}
                    disabled={disconnectMutation.isPending}
                    className="w-full border border-red-200 text-red-600 hover:bg-red-50 rounded-xl px-4 py-2.5 text-sm font-nav font-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {disconnectMutation.isPending ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Unlink size={16} />
                    )}
                    Disconnect Channel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-center py-4">
                <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto text-red-500 border border-red-100">
                  <Youtube size={32} />
                </div>
                <div className="space-y-1">
                  <p className="font-nav text-sm font-700 text-gray-700">Not Connected</p>
                  <p className="font-body text-xs text-gray-400">
                    Connect your YouTube channel to fetch and embed your latest video uploads dynamically.
                  </p>
                </div>
                <button
                  onClick={() => connectMutation.mutate()}
                  disabled={connectMutation.isPending}
                  className="btn-pink w-full px-4 py-2.5 text-sm flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
                >
                  {connectMutation.isPending ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Link2 size={16} />
                  )}
                  Connect YouTube
                </button>
              </div>
            )}
          </div>

          {/* Guidelines / Help Panel */}
          <div className="md:col-span-2 bg-white rounded-2xl p-6 shadow-sm border flex flex-col justify-between" style={{ borderColor: '#f0e0e8' }}>
            <div>
              <h2 className="font-heading text-lg font-700 text-gray-800 mb-2">How it works</h2>
              <ul className="space-y-2 text-gray-500 font-body text-sm list-disc pl-4">
                <li>Connecting your channel syncs the latest 6 video uploads directly to the database.</li>
                <li>Synchronization extracts the video titles, IDs, and thumbnail URLs.</li>
                <li>You can manually override, append new custom videos, or delete individual items in the list below.</li>
                <li>Make sure to save changes if you modify the video details manually.</li>
              </ul>
            </div>
            {isDirty && (
              <div className="mt-4 p-4 bg-pink-50 border border-pink-100 rounded-xl flex items-center justify-between gap-4">
                <span className="font-body text-xs text-pink-700 font-500">
                  ⚠️ You have unsaved manual edits in the video list.
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={handleResetManualChanges}
                    className="px-3 py-1.5 text-xs font-700 text-gray-500 hover:text-gray-800 transition-all"
                  >
                    Reset
                  </button>
                  <button
                    onClick={handleSaveManualChanges}
                    disabled={saveMutation.isPending}
                    className="btn-pink px-4 py-1.5 text-xs flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {saveMutation.isPending && <Loader2 size={12} className="animate-spin" />}
                    Save Changes
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Videos Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading text-xl font-700 text-gray-800">Synced & Custom Videos</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-pink px-4 py-2 text-xs flex items-center gap-2"
          >
            <Plus size={14} /> Add Video Manually
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border mb-6" style={{ borderColor: '#f0e0e8' }}>
            <form onSubmit={add} className="flex flex-col md:flex-row gap-3 items-end">
              <div className="flex-1 w-full">
                <label className="block font-nav text-xs font-700 uppercase tracking-wide text-gray-500 mb-1.5">
                  Video Title
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. Festival Special Lehenga Choli Saree"
                  className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-pink-500"
                  style={{ borderColor: 'var(--color-pink-light)' }}
                />
              </div>
              <div className="flex-1 w-full">
                <label className="block font-nav text-xs font-700 uppercase tracking-wide text-gray-500 mb-1.5">
                  YouTube Video ID
                </label>
                <input
                  type="text"
                  required
                  value={form.video_id}
                  onChange={(e) => setForm((f) => ({ ...f, video_id: e.target.value }))}
                  placeholder="e.g. dQw4w9WgXcQ"
                  className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-pink-500"
                  style={{ borderColor: 'var(--color-pink-light)' }}
                />
              </div>
              <button type="submit" className="btn-pink px-6 py-3 text-sm w-full md:w-auto">
                Add to List
              </button>
            </form>
          </div>
        )}

        {localVideos.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border" style={{ borderColor: '#f0e0e8' }}>
            <Youtube className="text-gray-300 w-12 h-12 mx-auto mb-3" />
            <p className="text-gray-500 font-body text-sm font-500">No videos currently configured.</p>
            <p className="text-gray-400 font-body text-xs mt-1">
              Connect your YouTube channel above and sync, or click "Add Video Manually" to get started.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {localVideos.map((video) => (
              <div
                key={video.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border transition-all duration-300 hover:shadow-md"
                style={{ borderColor: '#f0e0e8' }}
              >
                <div className="relative aspect-video bg-gray-100">
                  {video.video_id ? (
                    <img
                      src={`https://img.youtube.com/vi/${video.video_id}/mqdefault.jpg`}
                      alt={video.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback image if youtube thumbnail fails or uses custom thumbnail field
                        const target = e.target as HTMLImageElement
                        target.src = 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80'
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <Youtube size={32} className="text-gray-300" />
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <div className="w-11 h-11 rounded-full bg-red-600/90 hover:scale-105 transition-all flex items-center justify-center shadow-lg">
                      <span className="text-white text-lg ml-0.5">▶</span>
                    </div>
                  </div>
                </div>
                <div className="p-4 flex items-center justify-between gap-3 bg-white">
                  <div className="truncate flex-1">
                    <p className="font-nav font-700 text-sm text-gray-800 truncate" title={video.title}>
                      {video.title}
                    </p>
                    <p className="font-body text-[10px] text-gray-400 font-600 tracking-wider uppercase mt-0.5">
                      ID: {video.video_id}
                    </p>
                  </div>
                  <button
                    onClick={() => remove(video.id)}
                    className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-red-50 text-red-400 hover:text-red-500 transition-all border border-transparent hover:border-red-100"
                    title="Remove Video"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
