import { createServerFn } from '@tanstack/react-start'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'
import type { SocialLinks } from '../../types'
import fs from 'fs/promises'
import path from 'path'

const getFilePath = (fileName: string) => {
  return path.join(process.cwd(), 'src', 'server', 'data', fileName)
}

async function readJson<T>(fileName: string, defaultData: T): Promise<T> {
  try {
    const file = getFilePath(fileName)
    const raw = await fs.readFile(file, 'utf-8')
    return JSON.parse(raw)
  } catch (err) {
    return defaultData
  }
}

async function writeJson<T>(fileName: string, data: T): Promise<void> {
  const file = getFilePath(fileName)
  await fs.writeFile(file, JSON.stringify(data, null, 2), 'utf-8')
}

// 1. Get Social Links
export const getSocialLinksServerFn = createServerFn({
  method: 'GET',
}).handler(async () => {
  if (!isSupabaseConfigured()) {
    return await readJson<any>('social.json', {
      instagram: 'https://instagram.com/srisubhakarifashions',
      youtube: 'https://youtube.com/@srisubhakarifashions',
      facebook: 'https://facebook.com/srisubhakarifashions',
      linkedin: 'https://linkedin.com/company/srisubhakarifashions',
      whatsapp: 'https://wa.me/919346397838',
    })
  }

  const { data, error } = await supabase
    .from('social_links')
    .select('*')
    .single()

  if (error) {
    // If not found in DB but configured, return empty/defaults
    return {
      instagram: 'https://instagram.com/srisubhakarifashions',
      youtube: 'https://youtube.com/@srisubhakarifashions',
      facebook: 'https://facebook.com/srisubhakarifashions',
      linkedin: 'https://linkedin.com/company/srisubhakarifashions',
      whatsapp: 'https://wa.me/919346397838',
    }
  }
  return data
})

// 2. Update Social Links
export const updateSocialLinksServerFn = createServerFn({
  method: 'POST',
})
  .validator((social: any) => social)
  .handler(async ({ data: social }) => {
    if (!isSupabaseConfigured()) {
      await writeJson('social.json', social)
      return social
    }

    // Attempt to update the single row
    const { data: existing, error: fetchError } = await supabase
      .from('social_links')
      .select('id')
      .limit(1)

    if (fetchError) throw new Error(fetchError.message)

    if (existing && existing.length > 0) {
      const { data, error } = await supabase
        .from('social_links')
        .update({ ...social, updated_at: new Date().toISOString() })
        .eq('id', existing[0].id)
        .select()
        .single()
      if (error) throw new Error(error.message)
      return data
    } else {
      const { data, error } = await supabase
        .from('social_links')
        .insert({ ...social, updated_at: new Date().toISOString() })
        .select()
        .single()
      if (error) throw new Error(error.message)
      return data
    }
  })
