import { supabase, isSupabaseConfigured, supabaseUrl } from '../lib/supabase'

export interface MediaItem {
  name: string
  url: string
  created_at: string
  size: number
}

const DEFAULT_MEDIA: MediaItem[] = []

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
    const { data: storageFiles } = await supabase.storage.from('product-images').list('')
    const { data: generalFiles } = await supabase.storage.from('product-images').list('general')
    
    const items: MediaItem[] = []
    if (storageFiles && storageFiles.length > 0) {
      storageFiles.filter(f => f.name && f.id).forEach((f) => {
        items.push({
          name: f.name,
          url: `${cleanBase}/storage/v1/object/public/product-images/${f.name}`,
          size: f.metadata?.size || 0,
          created_at: f.created_at || new Date().toISOString(),
        })
      })
    }
    if (generalFiles && generalFiles.length > 0) {
      generalFiles.filter(f => f.name).forEach((f) => {
        items.push({
          name: f.name,
          url: `${cleanBase}/storage/v1/object/public/product-images/general/${f.name}`,
          size: f.metadata?.size || 0,
          created_at: f.created_at || new Date().toISOString(),
        })
      })
    }

    if (items.length > 0) {
      saveSharedMedia(items)
      return items
    }
  } catch (err: any) {
    console.warn('fetchSupabaseMedia notice:', err?.message || err)
  }

  return getSharedMedia()
}
