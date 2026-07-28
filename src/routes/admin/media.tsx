import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Upload, Trash2, Eye, Clipboard } from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'
import { getSharedMedia, saveSharedMedia, addSharedMedia, type MediaItem } from '../../utils/media'

export const Route = createFileRoute('/admin/media')({
  component: AdminMedia,
})

function AdminMedia() {
  const [mediaList, setMediaList] = useState<MediaItem[]>([])
  const [search, setSearch] = useState('')
  const [uploading, setUploading] = useState(false)
  const [previewImage, setPreviewImage] = useState<MediaItem | null>(null)

  // Load from shared utility
  useEffect(() => {
    setMediaList(getSharedMedia())
  }, [])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]

        // Validate format & size
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
        if (!allowedTypes.includes(file.type)) {
          alert(`Invalid format for ${file.name}. Allowed: JPG, JPEG, PNG, WEBP`)
          continue
        }
        if (file.size > 5 * 1024 * 1024) {
          alert(`File ${file.name} exceeds 5 MB size limit.`)
          continue
        }

        if (isSupabaseConfigured()) {
          const fileExt = file.name.split('.').pop()
          const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
          const filePath = fileName

          const { error } = await supabase.storage
            .from('products')
            .upload(filePath, file)

          if (error) throw error

          const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
          const publicUrl = `${supabaseUrl}/storage/v1/object/public/products/${filePath}`
          
          addSharedMedia(file.name, publicUrl, file.size)
        } else {
          // Local Base64 preview
          const reader = new FileReader()
          await new Promise<void>((resolve) => {
            reader.onloadend = () => {
              const result = reader.result as string
              addSharedMedia(file.name, result, file.size)
              resolve()
            }
            reader.readAsDataURL(file)
          })
        }
      }
      setMediaList(getSharedMedia())
      alert('Images uploaded successfully!')
    } catch (err: any) {
      alert('Failed to upload: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = (url: string) => {
    if (window.confirm('Delete this image from media library? This cannot be undone.')) {
      const updated = mediaList.filter(m => m.url !== url)
      setMediaList(updated)
      saveSharedMedia(updated)
    }
  }

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url)
    alert('URL copied to clipboard!')
  }

  const filteredMedia = mediaList.filter(m => m.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl font-700 text-gray-800">Media Library</h1>
          <p className="text-gray-500 text-sm mt-0.5">Manage and organize all uploaded store assets</p>
        </div>

        <div>
          <label className={`btn-pink px-5 py-2.5 text-sm flex items-center gap-2 cursor-pointer ${uploading ? 'opacity-60 cursor-not-allowed' : ''}`}>
            <Upload size={16} className={uploading ? 'animate-bounce' : ''} />
            {uploading ? 'Uploading...' : 'Upload Image'}
            <input type="file" accept="image/*" multiple onChange={handleUpload} disabled={uploading} className="hidden" />
          </label>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border mb-6" style={{ borderColor: '#f0e0e8' }}>
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search assets by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-pink-500"
            style={{ borderColor: 'var(--color-pink-light)' }}
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 font-body">
        {filteredMedia.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-400">No media assets found.</div>
        ) : (
          filteredMedia.map((media) => (
            <motion.div
              key={media.url}
              className="bg-white rounded-2xl border overflow-hidden group shadow-sm flex flex-col justify-between"
              style={{ borderColor: '#f0e0e8' }}
              layout
            >
              {/* Image Preview Container */}
              <div className="relative aspect-square bg-gray-50 overflow-hidden border-b border-gray-100 flex items-center justify-center">
                <img src={media.url} alt={media.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => setPreviewImage(media)}
                    className="p-1.5 bg-white rounded-full text-gray-700 hover:scale-110 transition-transform cursor-pointer"
                    title="View Image"
                  >
                    <Eye size={14} />
                  </button>
                  <button
                    onClick={() => copyToClipboard(media.url)}
                    className="p-1.5 bg-white rounded-full text-gray-700 hover:scale-110 transition-transform cursor-pointer"
                    title="Copy URL"
                  >
                    <Clipboard size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(media.url)}
                    className="p-1.5 bg-red-500 rounded-full text-white hover:scale-110 transition-transform cursor-pointer"
                    title="Delete Asset"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              
              {/* Title / Description */}
              <div className="p-3">
                <p className="text-xs font-nav font-700 text-gray-700 truncate" title={media.name}>{media.name}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{(media.size ? (media.size / 1024).toFixed(1) : 0)} KB</p>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-2xl w-full relative">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold text-lg cursor-pointer"
            >
              ✕
            </button>
            <h2 className="font-heading text-lg font-700 text-gray-800 mb-4">{previewImage.name}</h2>
            <div className="rounded-2xl overflow-hidden bg-gray-50 flex items-center justify-center border max-h-[70vh]">
              <img src={previewImage.url} alt="" className="max-w-full max-h-[60vh] object-contain" />
            </div>
            <div className="mt-4 flex justify-between items-center text-xs text-gray-400 font-body">
              <p>Uploaded: {previewImage.created_at}</p>
              <button
                onClick={() => copyToClipboard(previewImage.url)}
                className="text-pink-600 font-nav font-700 hover:underline cursor-pointer"
              >
                Copy Public URL
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
