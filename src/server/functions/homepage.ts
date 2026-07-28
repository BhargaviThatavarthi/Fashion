import { createServerFn } from '@tanstack/react-start'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'
import type { HomepageBanner, Product } from '../../types'
import fs from 'fs/promises'
import path from 'path'
import crypto from 'crypto'
import {
  getFeaturedProductsServerFn,
  getBestSellersServerFn,
  getNewArrivalsServerFn,
} from './products'

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

// 1. Get Homepage Data
export const getHomepageDataServerFn = createServerFn({
  method: 'GET',
}).handler(async () => {
  let banners: HomepageBanner[] = []

  if (!isSupabaseConfigured()) {
    banners = await readJson<HomepageBanner[]>('banners.json', [])
  } else {
    const { data, error } = await supabase
      .from('homepage_banner')
      .select('*')
      .eq('active', true)
      .order('created_at', { ascending: false })

    if (!error && data) {
      banners = data as HomepageBanner[]
    }
  }

  // Get products using already defined server functions
  const featured = await getFeaturedProductsServerFn()
  const bestSellers = await getBestSellersServerFn()
  const newArrivals = await getNewArrivalsServerFn()

  return {
    banners,
    featured,
    bestSellers,
    newArrivals,
  }
})

// 2. Get All Banners (for admin)
export const getBannersServerFn = createServerFn({
  method: 'GET',
}).handler(async () => {
  if (!isSupabaseConfigured()) {
    return await readJson<HomepageBanner[]>('banners.json', [])
  }

  const { data, error } = await supabase
    .from('homepage_banner')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return []
  return (data as HomepageBanner[]) || []
})

// 3. Update Banner Data (Admin)
export const updateBannerServerFn = createServerFn({
  method: 'POST',
})
  .validator((banner: any) => banner)
  .handler(async ({ data: banner }) => {
    if (!isSupabaseConfigured()) {
      const banners = await readJson<HomepageBanner[]>('banners.json', [])
      const idx = banners.findIndex((b) => b.id === banner.id)
      if (idx !== -1) {
        banners[idx] = { ...banners[idx], ...banner }
      } else {
        banners.push({
          id: Math.random().toString(36).substring(2, 11),
          active: true,
          ...banner,
        })
      }
      await writeJson('banners.json', banners)
      return banner
    }

    const { data: existing, error: checkError } = await supabase
      .from('homepage_banner')
      .select('id')
      .limit(1)

    if (checkError) throw new Error(checkError.message)

    if (existing && existing.length > 0) {
      const { data, error } = await supabase
        .from('homepage_banner')
        .update({ ...banner })
        .eq('id', existing[0].id)
        .select()
        .single()
      if (error) throw new Error(error.message)
      return data
    } else {
      const { data, error } = await supabase
        .from('homepage_banner')
        .insert({
          id: crypto.randomUUID(),
          title: banner.title || 'Elegance in Every Thread',
          subtitle: banner.subtitle || '',
          button_text: banner.button_text || 'Shop Collection',
          button_link: banner.button_link || '/shop',
          active: true,
        })
        .select()
        .single()
      if (error) throw new Error(error.message)
      return data
    }
  })
