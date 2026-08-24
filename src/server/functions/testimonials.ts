import { createServerFn } from '@tanstack/react-start'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'
import type { Testimonial } from '../../types'
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

// 1. Get Testimonials
export const getTestimonialsServerFn = createServerFn({
  method: 'GET',
}).handler(async () => {
  if (!isSupabaseConfigured()) {
    return await readJson<Testimonial[]>('testimonials.json', [])
  }

  const { data, error } = await supabase.from('testimonials').select('*')
  if (error) return []
  return (data as Testimonial[]) || []
})

// 2. Create Testimonial
export const createTestimonialServerFn = createServerFn({
  method: 'POST',
})
  .validator((t: Partial<Testimonial>) => t)
  .handler(async ({ data: t }) => {
    if (!isSupabaseConfigured()) {
      const list = await readJson<Testimonial[]>('testimonials.json', [])
      const newT: Testimonial = {
        id: Math.random().toString(36).substring(2, 11),
        created_at: new Date().toISOString(),
        customer_name: '',
        review: '',
        rating: 5,
        ...t,
      }
      list.unshift(newT)
      await writeJson('testimonials.json', list)
      return newT
    }

    const insertData = {
      id: crypto.randomUUID(),
      ...t
    }
    const { data, error } = await supabase.from('testimonials').insert(insertData).select().single()
    if (error) throw new Error(error.message)
    return data as Testimonial
  })

// 3. Update Testimonial
export const updateTestimonialServerFn = createServerFn({
  method: 'POST',
})
  .validator((data: { id: string; updates: Partial<Testimonial> }) => data)
  .handler(async ({ data: { id, updates } }) => {
    if (!isSupabaseConfigured()) {
      const list = await readJson<Testimonial[]>('testimonials.json', [])
      const idx = list.findIndex((item) => item.id === id)
      if (idx === -1) throw new Error('Testimonial not found')
      const updated = {
        ...list[idx],
        ...updates,
      }
      list[idx] = updated
      await writeJson('testimonials.json', list)
      return updated
    }

    const { data, error } = await supabase.from('testimonials').update(updates).eq('id', id).select().single()
    if (error) throw new Error(error.message)
    return data as Testimonial
  })

// 4. Delete Testimonial
export const deleteTestimonialServerFn = createServerFn({
  method: 'POST',
})
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    if (!isSupabaseConfigured()) {
      const list = await readJson<Testimonial[]>('testimonials.json', [])
      const updated = list.filter((item) => item.id !== id)
      await writeJson('testimonials.json', updated)
      return
    }

    const { error } = await supabase.from('testimonials').delete().eq('id', id)
    if (error) throw new Error(error.message)
  })
