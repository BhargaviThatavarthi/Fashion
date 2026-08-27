import { createFileRoute } from '@tanstack/react-router'
import { json } from '@tanstack/react-start'
import { supabase, isSupabaseConfigured, supabaseUrl } from '../../lib/supabase'
import { STORAGE_BUCKET } from '../../lib/storage'

export const Route = createFileRoute('/api/upload')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const formData = await request.formData()
          const file = formData.get('file') as File
          if (!file) {
            return json({ error: 'No file uploaded' }, { status: 400 })
          }

          if (isSupabaseConfigured()) {
            const fileExt = file.name.split('.').pop()
            const fileName = `uploads/${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`
            const buffer = await file.arrayBuffer()

            const { error } = await supabase.storage
              .from(STORAGE_BUCKET)
              .upload(fileName, buffer, {
                contentType: file.type || 'image/jpeg',
                upsert: true,
              })

            if (error) {
              return json({ error: error.message }, { status: 500 })
            }

            const cleanUrl = supabaseUrl.replace(/\/+$/, '')
            const publicUrl = `${cleanUrl}/storage/v1/object/public/${STORAGE_BUCKET}/${fileName}`
            return json({ url: publicUrl })
          } else {
            return json({ error: 'Supabase storage is not configured' }, { status: 500 })
          }
        } catch (err: any) {
          return json({ error: err.message }, { status: 500 })
        }
      },
    },
  },
})

