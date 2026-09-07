import { supabase, isSupabaseConfigured, supabaseUrl } from '../lib/supabase'
import { getImageUrl } from './format'

export interface MediaItem {
  name: string
  url: string
  created_at: string
  size: number
}

export function getSharedMedia(): MediaItem[] {
  if (typeof window === 'undefined') return []
  const saved = localStorage.getItem('ssf_media')
  if (saved) {
    try {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed)) {
        return parsed.filter((item) => item && item.url && !item.url.includes('placeholder'))
      }
    } catch {
      return []
    }
  }
  return []
}

export function saveSharedMedia(list: MediaItem[]) {
  if (typeof window !== 'undefined') {
    const valid = list.filter((item) => item && item.url && !item.url.includes('placeholder'))
    localStorage.setItem('ssf_media', JSON.stringify(valid))
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
    const cleanBase = (supabaseUrl && !supabaseUrl.includes('placeholder'))
      ? supabaseUrl.replace(/\/+$/, '')
      : 'https://kmxsgomxxhwpmoayeqmj.supabase.co'

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
            url: getImageUrl(url),
            size: m.file_size || 0,
            created_at: m.created_at || new Date().toISOString(),
          }
        })
        .filter((m) => m.url && !m.url.includes('placeholder'))

      saveSharedMedia(items)
      return items
    }
  } catch (err: any) {
    console.warn('fetchSupabaseMedia notice:', err?.message || err)
  }

  return getSharedMedia()
}
