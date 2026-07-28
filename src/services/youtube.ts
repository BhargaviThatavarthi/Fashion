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
  return await getYoutubeVideosServerFn()
}

export async function saveYoutubeVideos(videos: YoutubeVideo[]): Promise<YoutubeVideo[]> {
  return await saveYoutubeVideosServerFn({ data: videos })
}

export async function syncYoutubeVideos(): Promise<YoutubeVideo[]> {
  return await syncYoutubeVideosServerFn()
}
