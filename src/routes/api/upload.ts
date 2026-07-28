import { createFileRoute } from '@tanstack/react-router'
import { json } from '@tanstack/react-start'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'

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
            const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
            const buffer = await file.arrayBuffer()

            const { error } = await supabase.storage
              .from('products')
              .upload(fileName, buffer, {
                contentType: file.type,
              })

            if (error) {
              return json({ error: error.message }, { status: 500 })
            }

            const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
            const publicUrl = `${supabaseUrl}/storage/v1/object/public/products/${fileName}`
            return json({ url: publicUrl })
          } else {
            // Fallback for demo mode: Convert file to Base64 data URL
            const buffer = await file.arrayBuffer()
            const base64 = Buffer.from(buffer).toString('base64')
            const dataUrl = `data:${file.type};base64,${base64}`
            return json({ url: dataUrl })
          }
        } catch (err: any) {
          return json({ error: err.message }, { status: 500 })
        }
      },
    },
  },
})
