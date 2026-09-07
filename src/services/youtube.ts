import {
  getYoutubeConnectionStatusServerFn,
  getYoutubeAuthUrlServerFn,
  disconnectYoutubeServerFn,
  getYoutubeVideosServerFn,
  saveYoutubeVideosServerFn,
  syncYoutubeVideosServerFn,
} from '../server/functions/youtube'
import type { YoutubeVideo } from '../types'

export async function getYoutubeConnectionStatus() {
  return await getYoutubeConnectionStatusServerFn()
}

export async function getYoutubeAuthUrl() {
  return await getYoutubeAuthUrlServerFn()
}

export async function disconnectYoutube() {
  return await disconnectYoutubeServerFn()
}

export async function getYoutubeVideos(): Promise<YoutubeVideo[]> {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('ssf_youtube_videos')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed
        }
      } catch {}
    }
  }
  return await getYoutubeVideosServerFn()
}

export async function saveYoutubeVideos(videos: YoutubeVideo[]): Promise<YoutubeVideo[]> {
  if (typeof window !== 'undefined') {
    localStorage.setItem('ssf_youtube_videos', JSON.stringify(videos))
  }
  return await saveYoutubeVideosServerFn({ data: videos })
}

export async function syncYoutubeVideos(): Promise<YoutubeVideo[]> {
  const synced = await syncYoutubeVideosServerFn()
  if (typeof window !== 'undefined' && synced) {
    localStorage.setItem('ssf_youtube_videos', JSON.stringify(synced))
  }
  return synced
}
