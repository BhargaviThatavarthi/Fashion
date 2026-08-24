import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Upload, Trash2, Eye, Clipboard, CheckCircle2, AlertCircle, RefreshCw, Image as ImageIcon } from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'
import { getSharedMedia, saveSharedMedia, addSharedMedia } from '../../utils/media'
import type { MediaAsset } from '../../types'

export const Route = createFileRoute('/admin/media')({
  component: AdminMedia,
})

function AdminMedia() {
  const [mediaList, setMediaList] = useState<MediaAsset[]>([])
  const [search, setSearch] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [loading, setLoading] = useState(true)
  const [previewImage, setPreviewImage] = useState<MediaAsset | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }

  // Fetch all media assets from Supabase (or fallback to local storage)
  const fetchMediaAssets = async () => {
    setLoading(true)
    try {
      if (isSupabaseConfigured()) {
        const { data, error } = await supabase
          .from('media_assets')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error

        if (data && data.length > 0) {
          setMediaList(data as MediaAsset[])
          setLoading(false)
          return
        }
      }
    } catch (err: any) {
      console.warn('Supabase media fetch notice:', err.message)
    }

    // Fallback to local storage shared media
    const local = getSharedMedia().map((item, idx) => ({
      id: `local-${idx}`,
      file_name: item.name,
      file_path: item.name,
      public_url: item.url,
      file_size: item.size,
      file_type: 'image/png',
      created_at: item.created_at || new Date().toISOString(),
    }))
    setMediaList(local)
    setLoading(false)
  }

  useEffect(() => {
    fetchMediaAssets()
  }, [])

  // Handle local image file upload to Supabase Storage & Database
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    setUploadProgress(10)

    try {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
      let successCount = 0

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        setUploadProgress(Math.round(((i + 0.5) / files.length) * 100))

        if (!allowedTypes.includes(file.type)) {
          showToast(`Skipped ${file.name}: Invalid format. Allowed JPG, PNG, WEBP`, 'error')
          continue
        }

        if (file.size > 10 * 1024 * 1024) {
          showToast(`Skipped ${file.name}: Exceeds 10MB limit`, 'error')
          continue
        }

        const sanitizeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
        const filePath = `${Date.now()}_${sanitizeName}`

        let publicUrl = ''

        if (isSupabaseConfigured()) {
          try {
            // 1. Upload file to Supabase Storage bucket 'product-images'
            let { error: storageErr } = await supabase.storage
              .from('product-images')
              .upload(filePath, file, { cacheControl: '3600', upsert: true })

            if (storageErr) {
              // Fallback bucket check if 'product-images' does not exist yet
              const { error: altErr } = await supabase.storage
                .from('products')
                .upload(filePath, file, { cacheControl: '3600', upsert: true })

              if (altErr) throw storageErr
              publicUrl = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/products/${filePath}`
            } else {
              publicUrl = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/product-images/${filePath}`
            }

            // 2. Save metadata to Supabase 'media_assets' database table
            await supabase.from('media_assets').insert({
              file_name: file.name,
              file_path: filePath,
              public_url: publicUrl,
              file_type: file.type,
              file_size: file.size,
              created_at: new Date().toISOString(),
            })

            addSharedMedia(file.name, publicUrl, file.size)
            successCount++
          } catch (supabaseErr: any) {
            console.warn('Supabase storage upload notice, using local image fallback:', supabaseErr.message)
            const reader = new FileReader()
            await new Promise<void>((resolve) => {
              reader.onloadend = () => {
                publicUrl = reader.result as string
                addSharedMedia(file.name, publicUrl, file.size)
                successCount++
                resolve()
              }
              reader.readAsDataURL(file)
            })
          }
        } else {
          // Fallback: Read file as Base64 data URL locally
          const reader = new FileReader()
          await new Promise<void>((resolve) => {
            reader.onloadend = () => {
              publicUrl = reader.result as string
              addSharedMedia(file.name, publicUrl, file.size)
              successCount++
              resolve()
            }
            reader.readAsDataURL(file)
          })
        }
      }

      setUploadProgress(100)
      await fetchMediaAssets()
      showToast(`Successfully uploaded ${successCount} image(s) to Supabase Storage!`, 'success')
    } catch (err: any) {
      showToast(`Upload failed: ${err.message || 'Error uploading image'}`, 'error')
    } finally {
      setUploading(false)
      setUploadProgress(0)
      if (e.target) e.target.value = ''
    }
  }

  // Handle Image Deletion from Supabase Storage & Database
  const handleDelete = async (asset: MediaAsset) => {
    if (!window.confirm(`Delete "${asset.file_name}" from Supabase storage & media library?`)) return

    try {
      if (isSupabaseConfigured() && asset.file_path) {
        // Delete from Supabase database table
        await supabase.from('media_assets').delete().eq('file_path', asset.file_path)
        
        // Delete from Supabase Storage bucket 'product-images'
        await supabase.storage.from('product-images').remove([asset.file_path])
        await supabase.storage.from('products').remove([asset.file_path])
      }

      // Also clean up local storage fallback list
      const updatedLocal = getSharedMedia().filter((m) => m.url !== asset.public_url)
      saveSharedMedia(updatedLocal)

      setMediaList((prev) => prev.filter((m) => m.public_url !== asset.public_url))
      if (previewImage?.public_url === asset.public_url) setPreviewImage(null)

      showToast(`Deleted ${asset.file_name}`, 'success')
    } catch (err: any) {
      showToast(`Delete failed: ${err.message}`, 'error')
    }
  }

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url)
    showToast('Public image URL copied to clipboard!', 'success')
  }

  const filteredMedia = mediaList.filter((m) =>
    m.file_name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Toast Banner */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 right-4 z-50 p-4 rounded-2xl shadow-xl flex items-center gap-3 border text-xs font-nav font-700 ${
              toast.type === 'success'
                ? 'bg-emerald-900 text-white border-emerald-700'
                : 'bg-rose-900 text-white border-rose-700'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle2 size={18} className="text-emerald-400" /> : <AlertCircle size={18} className="text-rose-400" />}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-800 text-slate-900 tracking-tight">Media &amp; File Manager</h1>
          <p className="text-xs text-slate-500 mt-1">Upload files directly to Supabase Storage bucket <code className="bg-slate-200 px-1.5 py-0.5 rounded text-[11px] font-mono text-cyan-800">product-images</code></p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchMediaAssets}
            className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-cyan-600 hover:border-cyan-200 transition-colors shadow-2xs cursor-pointer"
            title="Refresh assets from Supabase"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>

          <label
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-nav font-700 text-white bg-cyan-600 hover:bg-cyan-500 transition-all shadow-md active:scale-98 cursor-pointer ${
              uploading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            <Upload size={16} className={uploading ? 'animate-bounce' : ''} />
            <span>{uploading ? `Uploading (${uploadProgress}%)...` : 'Upload Images'}</span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-2xs border border-slate-200/80">
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search assets by file name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 transition-all"
          />
        </div>
      </div>

      {/* Uploading Progress Bar */}
      {uploading && (
        <div className="bg-cyan-50 border border-cyan-200 rounded-2xl p-4">
          <div className="flex items-center justify-between text-xs font-nav font-700 text-cyan-800 mb-2">
            <span>Uploading to Supabase Storage (product-images)...</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="w-full bg-cyan-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-cyan-600 h-full transition-all duration-300 rounded-full"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Media Asset Grid */}
      {loading ? (
        <div className="bg-white rounded-3xl p-16 text-center shadow-2xs border border-slate-200/80">
          <RefreshCw size={28} className="animate-spin text-cyan-600 mx-auto mb-3" />
          <p className="text-xs font-nav font-700 text-slate-600">Loading Supabase media assets...</p>
        </div>
      ) : filteredMedia.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center shadow-2xs border border-slate-200/80">
          <div className="w-14 h-14 rounded-2xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-600 mx-auto mb-4">
            <ImageIcon size={28} />
          </div>
          <h3 className="font-heading text-lg font-800 text-slate-800">No media assets found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-5">Select images from your computer to upload directly to Supabase Storage</p>
          <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-nav font-700 text-white bg-cyan-600 hover:bg-cyan-500 transition-all shadow-md cursor-pointer">
            <Upload size={16} />
            <span>Select Local Image Files</span>
            <input type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" />
          </label>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredMedia.map((media) => (
            <motion.div
              key={media.public_url}
              className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden group shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
              layout
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-square bg-slate-900/5 overflow-hidden border-b border-slate-100 flex items-center justify-center">
                <img
                  src={media.public_url}
                  alt={media.file_name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-xs">
                  <button
                    onClick={() => setPreviewImage(media)}
                    className="p-2 bg-white/90 rounded-xl text-slate-800 hover:bg-white hover:scale-110 transition-transform cursor-pointer shadow-xs"
                    title="View Image"
                  >
                    <Eye size={15} />
                  </button>
                  <button
                    onClick={() => copyToClipboard(media.public_url)}
                    className="p-2 bg-white/90 rounded-xl text-slate-800 hover:bg-white hover:scale-110 transition-transform cursor-pointer shadow-xs"
                    title="Copy URL"
                  >
                    <Clipboard size={15} />
                  </button>
                  <button
                    onClick={() => handleDelete(media)}
                    className="p-2 bg-rose-600 rounded-xl text-white hover:bg-rose-500 hover:scale-110 transition-transform cursor-pointer shadow-xs"
                    title="Delete Asset"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              {/* Asset Name & Meta */}
              <div className="p-3">
                <p className="text-xs font-nav font-700 text-slate-800 truncate" title={media.file_name}>
                  {media.file_name}
                </p>
                <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                  <span>{media.file_size ? `${(media.file_size / 1024).toFixed(1)} KB` : 'File'}</span>
                  <span className="text-cyan-700 bg-cyan-50 px-1.5 py-0.5 rounded font-600">Supabase</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-6 max-w-2xl w-full relative shadow-2xl border border-slate-200"
          >
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center font-bold text-sm cursor-pointer transition-colors"
            >
              ✕
            </button>
            <h2 className="font-heading text-lg font-800 text-slate-900 mb-4 pr-8 truncate">
              {previewImage.file_name}
            </h2>
            <div className="rounded-2xl overflow-hidden bg-slate-900/5 flex items-center justify-center border border-slate-200 max-h-[60vh]">
              <img src={previewImage.public_url} alt="" className="max-w-full max-h-[55vh] object-contain" />
            </div>
            <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap justify-between items-center text-xs text-slate-500 font-sans gap-2">
              <div>
                <p className="font-nav font-600 text-slate-700">Public URL:</p>
                <p className="text-[11px] font-mono text-cyan-800 bg-cyan-50 px-2 py-1 rounded border border-cyan-100 max-w-md truncate mt-0.5">
                  {previewImage.public_url}
                </p>
              </div>
              <button
                onClick={() => copyToClipboard(previewImage.public_url)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-nav font-700 text-cyan-600 hover:text-cyan-700 bg-cyan-50 border border-cyan-200 transition-colors cursor-pointer"
              >
                <Clipboard size={14} />
                <span>Copy URL</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
