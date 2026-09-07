import { supabase, isSupabaseConfigured, supabaseUrl } from '../lib/supabase'

export interface MediaItem {
  name: string
  url: string
  created_at: string
  size: number
}

const DEFAULT_MEDIA: MediaItem[] = [
  { name: 'placeholder-saree-1.jpg', url: '/placeholder-saree-1.jpg', size: 124500, created_at: '2026-07-24' },
  { name: 'placeholder-saree-2.jpg', url: '/placeholder-saree-2.jpg', size: 98400, created_at: '2026-07-23' },
  { name: 'placeholder-lehenga.jpg', url: '/placeholder-lehenga.jpg', size: 245000, created_at: '2026-07-22' },
]

export function getSharedMedia(): MediaItem[] {
  if (typeof window === 'undefined') return DEFAULT_MEDIA
  const saved = localStorage.getItem('ssf_media')
  if (saved) {
    try {
      return JSON.parse(saved)
    } catch {
      return DEFAULT_MEDIA
    }
  }
  return DEFAULT_MEDIA
}

export function saveSharedMedia(list: MediaItem[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('ssf_media', JSON.stringify(list))
  }
}

export function addSharedMedia(name: string, url: string, size: number) {
  const list = getSharedMedia()
  if (!list.some((item) => item.url === url)) {
    const updated = [
      { name, url, size, created_at: new Date().toISOString().split('T')[0] },
      ...list,
    ]
    saveSharedMedia(updated)
  }
}

export async function fetchSupabaseMedia(): Promise<MediaItem[]> {
  try {
    const cleanBase = supabaseUrl.replace(/\/+$/, '')

    // 1. Fetch from media_assets table
    const { data: dbMedia, error } = await supabase
      .from('media_assets')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && dbMedia && dbMedia.length > 0) {
      const items: MediaItem[] = dbMedia
        .map((m: any) => {
          let url = m.public_url || ''
          if (!url && m.file_path) {
            url = `${cleanBase}/storage/v1/object/public/product-images/${m.file_path.replace(/^\/+/, '')}`
          }
          return {
            name: m.file_name || m.file_path || 'asset.jpg',
            url,
            size: m.file_size || 0,
            created_at: m.created_at || new Date().toISOString(),
          }
        })
        .filter((m) => m.url)

      if (items.length > 0) {
        saveSharedMedia(items)
        return items
      }
    }

    // 2. Fallback: inspect product-images storage bucket
    const { data: storageFiles } = await supabase.storage.from('product-images').list('general')
    if (storageFiles && storageFiles.length > 0) {
      const items: MediaItem[] = storageFiles.map((f) => ({
        name: f.name,
        url: `${cleanBase}/storage/v1/object/public/product-images/general/${f.name}`,
        size: f.metadata?.size || 0,
        created_at: f.created_at || new Date().toISOString(),
      }))
      saveSharedMedia(items)
      return items
    }
  } catch (err: any) {
    console.warn('fetchSupabaseMedia notice:', err?.message || err)
  }

  return getSharedMedia()
}
