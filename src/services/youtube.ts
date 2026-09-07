import { supabase, isSupabaseConfigured } from '../lib/supabase'
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
  if (typeof window !== 'undefined' && isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('youtube_videos')
        .select('*')
        .order('sort_order', { ascending: true })

      if (!error && data && data.length > 0) {
        return data as YoutubeVideo[]
      }
    } catch (err: any) {
      console.warn('Client getYoutubeVideos notice:', err?.message || err)
    }
  }
  return await getYoutubeVideosServerFn()
}

export async function saveYoutubeVideos(videos: YoutubeVideo[]): Promise<YoutubeVideo[]> {
  if (typeof window !== 'undefined' && isSupabaseConfigured()) {
    try {
      await supabase.from('youtube_videos').delete().neq('id', '___placeholder___')
      if (videos.length > 0) {
        const payload = videos.map((v, idx) => ({
          id: v.id || `yt-${idx}-${v.video_id}`,
          title: v.title,
          video_id: v.video_id,
          thumbnail: v.thumbnail || `https://img.youtube.com/vi/${v.video_id}/mqdefault.jpg`,
          sort_order: v.sort_order ?? idx,
          created_at: v.created_at || new Date().toISOString(),
        }))
        await supabase.from('youtube_videos').insert(payload)
      }
    } catch (err: any) {
      console.warn('Client saveYoutubeVideos notice:', err?.message || err)
    }
  }
  return await saveYoutubeVideosServerFn({ data: videos })
}

export async function syncYoutubeVideos(): Promise<YoutubeVideo[]> {
  return await syncYoutubeVideosServerFn()
}
