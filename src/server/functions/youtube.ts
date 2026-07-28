import { createServerFn } from '@tanstack/react-start'
import fs from 'fs/promises'
import path from 'path'
import { YOUTUBE_VIDEOS } from '../../constants'
import type { YoutubeVideo } from '../../types'

const TOKENS_FILE = path.join(process.cwd(), 'src', 'server', 'data', 'youtube_token.json')
const VIDEOS_FILE = path.join(process.cwd(), 'src', 'server', 'data', 'youtube_videos.json')

export interface YoutubeTokens {
  access_token: string
  refresh_token?: string
  expiry_date?: number
  channel_id?: string
  channel_title?: string
  uploads_playlist_id?: string
}

// Helper to get environment variables safely
export function getYoutubeConfig() {
  const clientId = process.env.GOOGLE_CLIENT_ID || import.meta.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET || import.meta.env.GOOGLE_CLIENT_SECRET
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || import.meta.env.GOOGLE_REDIRECT_URI

  return { clientId, clientSecret, redirectUri }
}

async function getTokens(): Promise<YoutubeTokens | null> {
  try {
    const data = await fs.readFile(TOKENS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return null
  }
}

async function saveTokens(tokens: YoutubeTokens): Promise<void> {
  const existing = await getTokens()
  const updated = {
    ...existing,
    ...tokens,
  }
  await fs.mkdir(path.dirname(TOKENS_FILE), { recursive: true })
  await fs.writeFile(TOKENS_FILE, JSON.stringify(updated, null, 2), 'utf-8')
}

async function clearTokens(): Promise<void> {
  try {
    await fs.unlink(TOKENS_FILE)
  } catch {}
}

async function getSavedVideos(): Promise<YoutubeVideo[]> {
  try {
    const data = await fs.readFile(VIDEOS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return YOUTUBE_VIDEOS
  }
}

async function saveVideos(videos: YoutubeVideo[]): Promise<void> {
  await fs.mkdir(path.dirname(VIDEOS_FILE), { recursive: true })
  await fs.writeFile(VIDEOS_FILE, JSON.stringify(videos, null, 2), 'utf-8')
}

async function refreshAccessToken(refreshToken: string): Promise<YoutubeTokens> {
  const { clientId, clientSecret } = getYoutubeConfig()
  
  if (!clientId || !clientSecret) {
    throw new Error('Google OAuth Client ID or Client Secret not configured.')
  }

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  })

  if (!res.ok) {
    const errText = await res.text()
    throw new Error(`Failed to refresh access token: ${errText}`)
  }

  const data = await res.json()
  return {
    access_token: data.access_token,
    expiry_date: Date.now() + data.expires_in * 1000,
  }
}

async function getUploadsPlaylistId(accessToken: string): Promise<{ playlistId: string; channelId: string; channelTitle: string }> {
  const res = await fetch('https://www.googleapis.com/youtube/v3/channels?part=contentDetails,snippet&mine=true', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!res.ok) {
    const errText = await res.text()
    throw new Error(`Failed to fetch channel details: ${errText}`)
  }

  const data = await res.json()
  const channel = data.items?.[0]
  if (!channel) {
    throw new Error('No YouTube channel found for authenticated account.')
  }

  const uploadsPlaylistId = channel.contentDetails?.relatedPlaylists?.uploads
  const channelId = channel.id
  const channelTitle = channel.snippet?.title

  if (!uploadsPlaylistId) {
    throw new Error('Could not retrieve uploads playlist ID.')
  }

  return {
    playlistId: uploadsPlaylistId,
    channelId,
    channelTitle,
  }
}

async function fetchPlaylistVideos(accessToken: string, playlistId: string): Promise<YoutubeVideo[]> {
  const res = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${playlistId}&maxResults=6`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!res.ok) {
    const errText = await res.text()
    throw new Error(`Failed to fetch playlist items: ${errText}`)
  }

  const data = await res.json()
  const items = data.items || []

  return items.map((item: any, idx: number) => {
    const snippet = item.snippet
    const videoId = snippet?.resourceId?.videoId
    const title = snippet?.title || 'YouTube Video'
    const thumbnail = snippet?.thumbnails?.medium?.url || snippet?.thumbnails?.default?.url || null

    return {
      id: item.id || `yt-${idx}`,
      title,
      video_id: videoId,
      thumbnail,
      sort_order: idx,
      created_at: snippet?.publishedAt || new Date().toISOString(),
    }
  })
}

// --- Server Functions ---

// 1. Get YouTube Connection Status
export const getYoutubeConnectionStatusServerFn = createServerFn({
  method: 'GET',
}).handler(async () => {
  const tokens = await getTokens()
  const { clientId, clientSecret, redirectUri } = getYoutubeConfig()

  return {
    configured: !!(clientId && clientSecret && redirectUri),
    connected: !!(tokens && tokens.refresh_token),
    channelTitle: tokens?.channel_title || null,
    channelId: tokens?.channel_id || null,
  }
})

// 2. Get YouTube OAuth URL
export const getYoutubeAuthUrlServerFn = createServerFn({
  method: 'GET',
}).handler(async () => {
  const { clientId, redirectUri } = getYoutubeConfig()
  
  if (!clientId || !redirectUri) {
    throw new Error('Google OAuth credentials not configured in environment variables.')
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'https://www.googleapis.com/auth/youtube.readonly',
    access_type: 'offline',
    prompt: 'consent',
  })

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
})

// 3. Disconnect YouTube
export const disconnectYoutubeServerFn = createServerFn({
  method: 'POST',
}).handler(async () => {
  await clearTokens()
  return { success: true }
})

// 4. Get Youtube Videos
export const getYoutubeVideosServerFn = createServerFn({
  method: 'GET',
}).handler(async () => {
  return await getSavedVideos()
})

// 5. Save Youtube Videos (manually updated)
export const saveYoutubeVideosServerFn = createServerFn({
  method: 'POST',
})
  .validator((videos: any) => videos as YoutubeVideo[])
  .handler(async ({ data: videos }) => {
    await saveVideos(videos)
    return videos
  })

// 6. Sync YouTube Videos (manually triggered sync)
export const syncYoutubeVideosServerFn = createServerFn({
  method: 'POST',
}).handler(async () => {
  const tokens = await getTokens()
  if (!tokens || !tokens.refresh_token) {
    throw new Error('YouTube channel not connected.')
  }

  // 1. Get a fresh access token
  const newTokens = await refreshAccessToken(tokens.refresh_token)
  await saveTokens(newTokens)

  // 2. Resolve playlistId if not already stored
  let playlistId = tokens.uploads_playlist_id
  if (!playlistId) {
    const channelInfo = await getUploadsPlaylistId(newTokens.access_token)
    playlistId = channelInfo.playlistId
    await saveTokens({
      ...newTokens,
      channel_id: channelInfo.channelId,
      channel_title: channelInfo.channelTitle,
      uploads_playlist_id: channelInfo.playlistId,
    })
  }

  // 3. Fetch latest videos from playlist
  const videos = await fetchPlaylistVideos(newTokens.access_token, playlistId)
  await saveVideos(videos)

  return videos
})
