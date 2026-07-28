import { createFileRoute } from '@tanstack/react-router'
import fs from 'fs/promises'
import path from 'path'

export const Route = createFileRoute('/api/youtube/callback')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const url = new URL(request.url)
          const code = url.searchParams.get('code')

          if (!code) {
            return new Response('Missing authorization code', { status: 400 })
          }

          const clientId = process.env.GOOGLE_CLIENT_ID || import.meta.env.GOOGLE_CLIENT_ID
          const clientSecret = process.env.GOOGLE_CLIENT_SECRET || import.meta.env.GOOGLE_CLIENT_SECRET
          const redirectUri = process.env.GOOGLE_REDIRECT_URI || import.meta.env.GOOGLE_REDIRECT_URI

          // Exchange auth code for tokens
          const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
              code,
              client_id: clientId || '',
              client_secret: clientSecret || '',
              redirect_uri: redirectUri || '',
              grant_type: 'authorization_code',
            }),
          })

          if (!tokenRes.ok) {
            const errText = await tokenRes.text()
            return new Response(`Failed to exchange code: ${errText}`, { status: 500 })
          }

          const tokenData = await tokenRes.json()

          // Get channel details to store title, id, and playlist ID
          const channelRes = await fetch('https://www.googleapis.com/youtube/v3/channels?part=contentDetails,snippet&mine=true', {
            headers: {
              Authorization: `Bearer ${tokenData.access_token}`,
            },
          })

          if (!channelRes.ok) {
            const errText = await channelRes.text()
            return new Response(`Failed to get channel details: ${errText}`, { status: 500 })
          }

          const channelData = await channelRes.json()
          const channel = channelData.items?.[0]

          if (!channel) {
            return new Response('No YouTube channel found', { status: 400 })
          }

          const uploadsPlaylistId = channel.contentDetails?.relatedPlaylists?.uploads
          const channelId = channel.id
          const channelTitle = channel.snippet?.title

          // Save tokens
          const TOKENS_FILE = path.join(process.cwd(), 'src', 'server', 'data', 'youtube_token.json')
          const tokenPayload = {
            access_token: tokenData.access_token,
            refresh_token: tokenData.refresh_token, // offline access returns refresh token on first consent
            expiry_date: Date.now() + tokenData.expires_in * 1000,
            channel_id: channelId,
            channel_title: channelTitle,
            uploads_playlist_id: uploadsPlaylistId,
          }

          await fs.mkdir(path.dirname(TOKENS_FILE), { recursive: true })

          // If refresh_token is missing (e.g. user re-authenticated), merge with existing refresh token
          try {
            const existing = JSON.parse(await fs.readFile(TOKENS_FILE, 'utf-8'))
            if (!tokenPayload.refresh_token && existing.refresh_token) {
              tokenPayload.refresh_token = existing.refresh_token
            }
          } catch {}

          await fs.writeFile(TOKENS_FILE, JSON.stringify(tokenPayload, null, 2), 'utf-8')

          // Fetch initial videos
          if (uploadsPlaylistId) {
            const videosRes = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${uploadsPlaylistId}&maxResults=6`, {
              headers: {
                Authorization: `Bearer ${tokenData.access_token}`,
              },
            })

            if (videosRes.ok) {
              const videosData = await videosRes.json()
              const items = videosData.items || []
              const videos = items.map((item: any, idx: number) => {
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

              const VIDEOS_FILE = path.join(process.cwd(), 'src', 'server', 'data', 'youtube_videos.json')
              await fs.writeFile(VIDEOS_FILE, JSON.stringify(videos, null, 2), 'utf-8')
            }
          }

          // Redirect back to admin youtube page
          return new Response(null, {
            status: 302,
            headers: {
              Location: '/admin/youtube?connected=true',
            },
          })
        } catch (err: any) {
          return new Response(`Callback error: ${err.message}`, { status: 500 })
        }
      },
    },
  },
})
