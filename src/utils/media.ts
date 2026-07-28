// Shared Media Library Helpers for local/demo mode

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
  localStorage.setItem('ssf_media', JSON.stringify(DEFAULT_MEDIA))
  return DEFAULT_MEDIA
}

export function saveSharedMedia(list: MediaItem[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('ssf_media', JSON.stringify(list))
  }
}

export function addSharedMedia(name: string, url: string, size: number) {
  const list = getSharedMedia()
  // Check duplicate URL
  if (!list.some(item => item.url === url)) {
    const updated = [
      { name, url, size, created_at: new Date().toISOString().split('T')[0] },
      ...list
    ]
    saveSharedMedia(updated)
  }
}
